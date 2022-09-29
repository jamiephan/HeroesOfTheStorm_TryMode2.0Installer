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
  runOnlineMap,
  runInstalledMap,
  installMapFromFile,
} from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

let mainWindow: BrowserWindow | null = null;

const validateSettings = async () => {
  const heroesPath = await settings.get('heroesPath');
  const skipHeroesPathCheck = await settings.get('skipHeroesPathCheck');
  let newHeroesPath = heroesPath;
  const newInstalledMaps: string[] = [];

  // Check heroes installation
  try {
    const isDir = (await fs.promises.stat(newHeroesPath)).isDirectory();
    if (!isDir) {
      newHeroesPath = null;
    } else if (!skipHeroesPathCheck) {
      const isValid = validateHeroesPath(newHeroesPath);
      if (!isValid) {
        newHeroesPath = null;
      }
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

const stormWindows = {};

ipcMain.on('close-storm-map-generator', async (event, cfg) => {
  if (stormWindows[cfg.name]) {
    return stormWindows[cfg.name].close();
  }
});

ipcMain.on('open-storm-map-generator', async (event, cfg) => {
  const activeStormmapGeneratorWindow = await settings.get(
    'activeStormmapGeneratorWindow'
  );

  if (stormWindows[cfg.name]) {
    return stormWindows[cfg.name].show();
  }

  if (!activeStormmapGeneratorWindow.includes(cfg.name)) {
    activeStormmapGeneratorWindow.push(cfg.name);
    await settings.set(
      'activeStormmapGeneratorWindow',
      activeStormmapGeneratorWindow
    );
    event.reply('get-settings', await settings.get());
  }

  const heroesPath = await settings.get('heroesPath');
  stormWindows[cfg.name] = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: getAssetPath('icon.png'),
    backgroundColor: '#1a0933',
  });

  stormWindows[cfg.name].setMenu(null);
  stormWindows[cfg.name].setTitle(
    `Try Mode 2.0 Installer - Storm Map Generator for ${cfg.name}`
  );

  // Disable Navigation
  stormWindows[cfg.name].webContents.on('will-navigate', (e) => {
    e.preventDefault();
  });

  stormWindows[cfg.name].webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Clean up on close
  stormWindows[cfg.name].on('closed', async () => {
    stormWindows[cfg.name] = null;

    if (activeStormmapGeneratorWindow.includes(cfg.name)) {
      // activeStormmapGeneratorWindow.filter((n) => n !== cfg.name);
      activeStormmapGeneratorWindow.splice(
        activeStormmapGeneratorWindow.indexOf(cfg.name),
        1
      );
      await settings.set(
        'activeStormmapGeneratorWindow',
        activeStormmapGeneratorWindow
      );
    }

    await validateSettings();
    event.reply('get-settings', await settings.get());
    mainWindow.focus();
  });

  stormWindows[cfg.name].on('page-title-updated', (e) => {
    e.preventDefault();
  });

  // On stormmap download
  stormWindows[cfg.name].webContents.session.on(
    'will-download',
    async (e, item, webContents) => {
      item.setSavePath(path.normalize(`${heroesPath}/${cfg.path}/${cfg.file}`));
      item.once('done', async (ev, state) => {
        if (state === 'completed') {
          console.log('Download successfully');
          event.reply('finish-install-map', {
            success: true,
            message: `The generated map have been successfully installed. Please launch ${cfg.name} in the game to use the map.`,
          });
          stormWindows[cfg.name].close();
        } else {
          console.log(`Download failed: ${state}`);
          event.reply('finish-install-map', {
            success: false,
            message: 'The download have been interrupted.',
          });
        }
      });
    }
  );

  await stormWindows[cfg.name].loadURL(
    `https://stormmap.jamiephan.net/?type=INSTALLER&mapName=${cfg.name}`
  );
  stormWindows[cfg.name].focus();
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

ipcMain.on('open-installed-map', async (event, map) => {
  await validateSettings();
  const heroesPath = await settings.get('heroesPath');

  // Open the map
  try {
    const mapPath = `${heroesPath}/${config.heroes.mapsPath[map].path}/${config.heroes.mapsPath[map].file}`;
    shell.showItemInFolder(path.normalize(mapPath));
  } catch (e) {
    event.reply('electron-ipc-error', e.message);
  }
});

ipcMain.on('run-installed-map', async (event, map) => {
  // Run the map
  const heroesPath = await settings.get('heroesPath');
  const result = runInstalledMap(map, heroesPath);
  if (!result.success) {
    event.reply('electron-ipc-error', result.message);
  }
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

ipcMain.on('open-folder', async (event, fileDirPath) => {
  if (fileDirPath) {
    shell.openPath(path.normalize(fileDirPath));
  } else {
    event.reply('electron-ipc-error', `Invalid Folder Path: ${fileDirPath}`);
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

const tempMapsToCleanUp: string[] = [];
ipcMain.on('run-map', async (event, config) => {
  const heroesPath = await settings.get('heroesPath');
  const result = await runOnlineMap(config, heroesPath);
  if (!result.success) {
    event.reply('electron-ipc-error', result.message);
  } else {
    tempMapsToCleanUp.push(result.tempMapPath);
  }
});

ipcMain.on('install-map-from-file', async (event, config) => {
  const heroesPath = await settings.get('heroesPath');

  const result = await installMapFromFile(config, heroesPath);

  await validateSettings();
  event.reply('get-settings', await settings.get());

  if (result.success) {
    event.reply('electron-ipc-success', result.message);
  } else {
    event.reply('electron-ipc-error', result.message);
  }
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
    showStormMapGenerator: false,
    showMoreSettings: false,
    skipHeroesPathCheck: false,
    showStormMapGeneratorDescription: true,
    showMapInstallDescription: true,
    showConfirmDeletedMap: true,
    installedMaps: [],
    activeStormmapGeneratorWindow: [],
    platform: process.platform,
    mapFilterText: '',
  };

  settings.setSync({
    ...defaultSettings,
    ...(await settings.get()),
    activeStormmapGeneratorWindow: [],
  });

  mainWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,
    frame: false,
    minWidth: 768,
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
  tempMapsToCleanUp.forEach((tempMapPath) => {
    try {
      fs.unlinkSync(tempMapPath);
    } catch (e) {}
  });

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
