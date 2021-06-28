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

Right now, no executable will be released yet (in TODO list), to get started you would need `nodejs` installed:

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
 - Icon for the Installer
 - Allows to run any `*.stormmap` directly
 - Allows to use any `*.stormmap`
 - Create Installer / executable
 - Github Release via Github Action
 - `*.stormmod` management (via `/mods`)
 - ``
