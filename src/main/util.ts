/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import tmp from 'tmp';
import child_process from 'child_process';
import mapConfig from '../../config';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

// Get Heroes of the Storm Path from bnet Agent API
// Special Thanks for wowwiki: https://wowdev.wiki/Agent
// export let getHeroesPath: () => Promise<string | null>;

export const getHeroesPath = async (): Promise<string | null> => {
  // Fetch Agent for Auth Key
  try {
    const agentJson = await axios.get('http://localhost:1120/agent');
    // const agentJson = await agent.json();

    const authKey = agentJson.data?.authorization;

    // Fetch Heroes of the Storm Path
    // There are issue with the API that does not follow the RESTful API spec. Headers should be non-case insensitive.
    // However, Agent API Header checking is case sensitive, and axios will auto convert it to small case, which will cause issues with the API.
    // Since there isn't an option to disable this behavior in axios,
    // It will temporarily override the String.prototype.toLowerCase() function to prevent case conversion by axios.

    const originalLowerCase = String.prototype.toLowerCase;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-extend-native, func-names
    String.prototype.toLowerCase = function () {
      return this;
    };

    const heroesFetch = axios.get('http://localhost:1120/game/heroes', {
      headers: {
        Authorization: authKey,
        'User-Agent': 'phoenix-agent/1.0',
      },
    });
    // eslint-disable-next-line no-extend-native
    String.prototype.toLowerCase = originalLowerCase;

    const heroesJson = await heroesFetch;
    // const heroesJson = await heroes.json();

    return heroesJson.data?.install_dir;
  } catch (e) {
    return null;
  }
};

export const validateHeroesPath = (heroesPath: string): boolean => {
  // Windows Checking
  if (process.platform === 'win32') {
    const dir = heroesPath;
    if (!fs.existsSync(dir)) return false;
    const requiredDirectories = [
      'HeroesData',
      'Support',
      'Support64',
      'Versions',
    ];
    const requiredFiles = ['.patch.result', '.product.db', 'Launcher.db'];

    const dirLists = fs.readdirSync(dir, { withFileTypes: true });

    let dCheck = 0;
    let fCheck = 0;

    dirLists.forEach((dirList) => {
      if (requiredDirectories.includes(dirList.name) && dirList.isDirectory())
        dCheck += 1;
      if (requiredFiles.includes(dirList.name) && dirList.isFile()) fCheck += 1;
    });

    if (
      dCheck !== requiredDirectories.length ||
      fCheck !== requiredFiles.length
    ) {
      return false;
    }
    return true;
  }

  // TODO: Add other platforms
  // MacOS Checking
  if (process.platform === 'darwin') {
    return false;
  }

  // Linux Checking
  if (process.platform === 'linux') {
    return false;
  }

  return false;
};

const downloadMap = async (
  url: string,
  folder: string,
  filename: string
): Promise<object> => {
  try {
    console.log(`Downloading ${url}...`);
    const download = await axios({
      method: 'GET',
      responseType: 'arraybuffer',
      url,
    });

    const file = Buffer.from(download.data);
    console.log(`Downloaded File. Length: ${file.length}`);

    // If target folder exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }

    // Save to file
    fs.writeFileSync(`${folder}/${filename}`, file);

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const installOnlineMap = async (
  config: object,
  heroesPath: string
): Promise<object> => {
  const result = await downloadMap(
    config.downloadLink,
    `${heroesPath}/${config.path}`,
    config.file
  );
  return {
    success: result.success,
    message: result.success
      ? `${config.downloadPrettyName} have been successfully installed. Please launch ${config.name} in the game to use the map.`
      : result.error.message,
  };
};

export const installMapFromFile = async (
  config: object,
  heroesPath: string
): Promise<object> => {
  try {
    console.log(`Copying ${config.filePath}...`);

    const folder = `${heroesPath}/${config.map.path}`;

    // If target folder exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }

    // Save to file
    fs.writeFileSync(
      `${folder}/${config.map.file}`,
      fs.readFileSync(config.filePath)
    );

    return {
      success: true,
      message: `${config.filePath} have been successfully installed to ${config.map.name}.`,
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

export const runInstalledMap = (map: string, heroesPath: string): Object => {
  const mapObj = mapConfig.heroes.mapsPath[map];

  try {
    if (process.platform === 'win32') {
      child_process.execSync(
        `"${heroesPath}/Support64/HeroesSwitcher_x64.exe" "${mapObj.path.replace(
          '/maps/',
          ''
        )}/${mapObj.file}"`
      );
      return {
        success: true,
        message: `${mapObj.name} have been launched.`,
      };
    }
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
  return {
    success: false,
    message: `Unsupported Platform to run the map directly.`,
  };
};

export const runOnlineMap = async (
  config: object,
  heroesPath: string
): Promise<object> => {
  const tempFile = tmp.fileSync({
    postfix: '.stormmap',
    discardDescriptor: true,
  });

  const result = await downloadMap(
    config.downloadLink,
    path.dirname(tempFile.name),
    path.basename(tempFile.name)
  );

  if (result) {
    try {
      if (process.platform === 'win32') {
        child_process.execSync(
          `"${heroesPath}/Support64/HeroesSwitcher_x64.exe" "${tempFile.name.replace(
            /\\/g,
            '/'
          )}"`
        );
        return {
          success: true,
          message: `${config.downloadPrettyName} have been launched.`,
          tempMapPath: tempFile.name,
        };
      }
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }

    return {
      success: false,
      message: `Unsupported Platform to run the map directly.`,
    };
  }
  return {
    success: false,
    message: result.error.message,
  };
};
