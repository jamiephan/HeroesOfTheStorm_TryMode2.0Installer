# HeroesOfTheStorm_TryMode2.0Installer
Installer for Heroes of the Storm - Try Mode 2.0

A Simple Installer for [Heroes of the Storm - Try Mode 2.0](https://jamiephan.github.io/HeroesOfTheStorm_TryMode2.0/)

## Features:

- Get and Validate Heroes of the Storm installation path via Blizzard Agent Restful API
- Install `stormmap` files to override local game mode (Such as Try Mode / Tutorial)
  - This allows you to run the custom map by launching the mode in game
  - Currently, There are two main source of custom maps:
    - [Try Mode 2.0](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases/latest)
    - [Storm Map Generator](https://stormmap.jamiephan.net/) Integration
      - You can use it to get [official maps](https://github.com/jamiephan/HeroesOfTheStorm_S2MA), [maps with AI Patch](https://github.com/jamiephan/HeroesOfTheStorm_AIMapshttps://github.com/jamiephan/HeroesOfTheStorm_AIMaps) and can customize the map data yourself.
      - For more details, please refer to the [Storm Map Generator](https://stormmap.jamiephan.net/) website or check out the [Storm Map Generator](https://github.com/jamiephan/HeroesOfTheStorm_StormMapGenerator) repo.
- Launch the maps directly without needing to install / override the current map.


## Installation:

Navigate to [Github Release](https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0Installer/releases/latest), download and execute of the files:

- `TryMode2.0Installer-{version}-win_x64.exe`
  - A single executable to run the application. No Setup/Extraction needed.
- `TryMode2.0Installer-{version}-win_x64.zip`
  - A Compressed file for the application.
- `TryMode2.0InstallerSetup-{version}-win_x64.exe`
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
 - [x] Allow to run the map directly without overriding local map
 - [x] Integrate [Storm Map Generator](https://stormmap.jamiephan.net/)
 - [x] Add a filter/search functionality for map list
 - [ ] Add Linux/MacOS Support and Binary Build
 - [x] Icon for the Installer. (For now is Heroes's Icon)
 - [ ] Allows to run any `*.stormmap` directly
 - [ ] Allows to use any `*.stormmap`
 - [ ] `*.stormmod` management (via `/mods`)


## Screenshots:

### Main UI: 
![Main UI](https://i.imgur.com/jIntFtH.png)

### Try Mode 2.0 List:
![Map List](https://i.imgur.com/La7E3fb.png)

### Storm Map Generator Launcher:
![Storm Map Generator launcher](https://i.imgur.com/2lH8CaT.png)
