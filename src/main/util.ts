/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import axios from 'axios';
import fs from 'fs';

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

export const installOnlineMap = async (
  config: Object,
  heroesPath: string
): Promise<Object> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log(config);
    console.log(`Downloading ${config.downloadLink}...`);
    const download = await axios.get(config.downloadLink);
    const file = Buffer.from(download.data);
    console.log(`File Length: ${file.length}`);

    // If target folder exist
    if (!fs.existsSync(`${heroesPath}/${config.path}`)) {
      fs.mkdirSync(heroesPath + config.path, {
        recursive: true,
      });
    }

    // Save to file
    fs.writeFileSync(`${heroesPath}/${config.path}/${config.file}`, file);

    return {
      success: true,
      message: `${config.downloadPrettyName} have been successfully installed. Please launch ${config.name} in the game to use the map.`,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};
