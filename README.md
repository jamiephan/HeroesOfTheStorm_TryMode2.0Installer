# HeroesOfTheStorm_TryMode2.0Installer
Installer for Heroes of the Storm - Try Mode 2.0

A simple installer for [Heroes of the Storm - Try Mode 2.0](https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/)

## Features:

- Fetch all map files from the [Try Mode 2.0 Page](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases/latest)
- Apply the map in game ([rename the maps](https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/install.html#runStormmap-customstormmap))
- Manage the installed maps (Currently only support backup (manual restore) and delete)

## Screenshots:

> ❗ Please note that this is not final, as its a first draft of the installer. The UI will **definitely** be much better in the future.

![Main UI](https://i.imgur.com/hi4BlMw.png)

## Installation:

Navigate to [Github Release](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest), download and execute of the files:

- `TryMode2.0Installer-0.0.1-win_x64.exe`
  - A single executable to run the application. No Setup/Extraction needed.
- `TryMode2.0Installer-0.0.1-win_x64.zip`
  - A Compressed file for the application.
- `TryMode2.0InstallerSetup-0.0.1-win_x64.exe`
  - A Setup Installer for the application. It will show up on your Start Menu/Installed Programs/Uninstall, like most installed programs that ran though a Setup process.

Development:

```bash
git clone https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer.git
cd HeroesOfTheStorm_TryMode2.0Installer
npm install
npm start
```

## Note:
⚠ This installer is still under heavy construction. Basic function should work but might have some bugs. The UI is the most ugly installer in the world.

## TODOs:

 - Overhaul the architecture (right now is just a quick draft)
 - Make the UI more beautiful
 - Add Linux/MacOS Support and Binary Build
 - Icon for the Installer
 - Allows to run any `*.stormmap` directly
 - Allows to use any `*.stormmap`
 - `*.stormmod` management (via `/mods`)
