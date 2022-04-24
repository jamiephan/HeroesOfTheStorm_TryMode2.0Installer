# HeroesOfTheStorm_TryMode2.0Installer
Installer for Heroes of the Storm - Try Mode 2.0

A Simple Installer for [Heroes of the Storm - Try Mode 2.0](https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/)

## Features:

- Get Heroes of the Storm install path via Blizzard API (Agent Restful)
- Fetch all map files from the [Try Mode 2.0 Page](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases/latest)
- Apply the map in game ([rename the maps](https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/install.html#runStormmap-customstormmap))
- Remove Installed Maps

## Screenshots:


![Main UI](https://i.imgur.com/hgEh7bI.png)

## Installation:

Navigate to [Github Release](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest), download and execute of the files:

- [`TryMode2.0Installer-1.0.0-win_x64.exe`](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest/download/TryMode2.0Installer-1.0.0-win_x64.exe)
  - A single executable to run the application. No Setup/Extraction needed.
- [`TryMode2.0Installer-1.0.0-win_x64.zip`](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest/download/TryMode2.0Installer-1.0.0-win_x64.zip)
  - A Compressed file for the application.
- [`TryMode2.0InstallerSetup-1.0.0-win_x64.exe`](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest/download/TryMode2.0InstallerSetup-1.0.0-win_x64.exe)
  - A Setup Installer for the application. It will show up on your Start Menu/Installed Programs/Uninstall, like most installed programs that ran though a Setup process.

## Development:

```bash
git clone https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer.git
cd HeroesOfTheStorm_TryMode2.0Installer
npm install
npm start
# This should launch a watch process and restart if any thing have changed
```

## Build: 
```bash
npm run package
# Then navigate to ./release/build
```

## TODOs:

 - [x] ([ALPHA](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/tree/ALPHA)) Overhaul the architecture (right now is just a quick draft)
 - [x] ([ALPHA](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/tree/ALPHA)) Make the UI more beautiful
 - [ ] Allow to run the map directly without overriding local map
 - [ ] Add Linux/MacOS Support and Binary Build
 - [ ] Icon for the Installer. (For now is Heroes's Icon)
 - [ ] Allows to run any `*.stormmap` directly
 - [ ] Allows to use any `*.stormmap`
 - [ ] `*.stormmod` management (via `/mods`)
