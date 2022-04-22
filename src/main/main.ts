/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import settings from 'electron-settings';
import fs from 'fs';
import MenuBuilder from './menu';
import config from '../../config';
import {
  resolveHtmlPath,
  getHeroesPath,
  validateHeroesPath,
  installOnlineMap,
} from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const validateSettings = async () => {
  const heroesPath = await settings.get('heroesPath');
  let newHeroesPath = heroesPath;
  const newInstalledMaps: string[] = [];

  // Check heroes installation
  try {
    const isDir = (await fs.promises.stat(newHeroesPath)).isDirectory();
    if (!isDir) {
      newHeroesPath = null;
    }
  } catch (e) {
    newHeroesPath = null;
  }

  // Check installMaps
  if (newHeroesPath) {
    Object.keys(config.heroes.mapsPath).forEach(async (map) => {
      const mapData = config.heroes.mapsPath[map];
      try {
        const isValid = (
          await fs.promises.stat(
            `${newHeroesPath}/${mapData.path}/${mapData?.file}`
          )
        ).isFile();
        if (isValid) newInstalledMaps.push(map);
      } catch (e) {}
    });
  }

  await settings.set('heroesPath', newHeroesPath);
  await settings.set('installedMaps', newInstalledMaps);
  return null;
};

// Close Button event
ipcMain.on('close-window', () => {
  // mainWindow.close();
  app.quit();
});

ipcMain.on('delete-installed-map', async (event, map) => {
  const heroesPath = await settings.get('heroesPath');
  const installedMaps = await settings.get('installedMaps');

  // Delete the map
  try {
    await fs.promises.unlink(
      `${heroesPath}/${config.heroes.mapsPath[map].path}/${config.heroes.mapsPath[map].file}`
    );
  } catch (e) {
    event.reply('electron-ipc-error', e.message);
  }
  event.reply(
    'electron-ipc-success',
    `${config.heroes.mapsPath[map].name} has been successfully deleted. It will be restored to the original map.`
  );

  await validateSettings();
  event.reply('get-settings', await settings.get());
});

ipcMain.on('get-settings', async (event) => {
  await validateSettings();
  event.reply('get-settings', await settings.get());
});

ipcMain.on('set-settings', async (event, newSettings) => {
  await settings.set(newSettings);
  await validateSettings();
  event.reply('get-settings', await settings.get());
});

ipcMain.on('open-folder', async (event, path) => {
  if (path) {
    shell.openPath(path);
  } else {
    event.reply('electron-ipc-error', `Invalid Folder Path: ${path}`);
  }
});

ipcMain.on('open-heroes-install-dialog', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '**Please select the Heroes of the Storm Installation Folder**',
  });

  if (result) {
    const selectedPath = result.filePaths[0];
    // eslint-disable-next-line no-extra-boolean-cast
    if (selectedPath) {
      // Check Heroes validation
      const isSkipChecking = await settings.get('skipHeroesPathCheck');
      if (!isSkipChecking) {
        if (validateHeroesPath(selectedPath)) {
          await settings.set('heroesPath', selectedPath);
        } else {
          event.reply(
            'electron-ipc-error',
            `"${selectedPath}" is not a valid Heroes of the Storm installation folder. Please select another folder. If you believe this is the correct folder, please set the "skipHeroesPathCheck" to "true".`
          );
        }
      } else {
        await settings.set('heroesPath', selectedPath);
      }
    } else {
      // event.reply('electron-ipc-error', 'No folder were selected');
    }
  } else {
    event.reply('electron-ipc-error', 'Error when selecting file');
  }

  await validateSettings();
  event.reply('get-settings', await settings.get());
});

ipcMain.on('install-map', async (event, config) => {
  const heroesPath = await settings.get('heroesPath');
  event.reply('finish-install-map', await installOnlineMap(config, heroesPath));

  await validateSettings();
  event.reply('get-settings', await settings.get());
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
    // Clear all for debug
    await settings.unset();
  }

  const defaultSettings = {
    appName: 'Try Mode 2.0 Installer',
    heroesPath: await getHeroesPath(),
    skipHeroesPathCheck: false,
    installedMaps: [],
  };

  settings.setSync({ ...defaultSettings, ...(await settings.get()) });

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,
    frame: false,
    // resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  mainWindow.setMenu(null);
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
