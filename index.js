// Script to launch Electron

const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require("fs")
const { app, BrowserWindow } = require('electron')
const mkdirp = require('mkdirp')

const config = require("./config")
let heroesInstallationPath = null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // win.removeMenu()
  win.loadFile('index.html')

  const validateHeroesInstallation = (heroesPath) => {
    const dir = heroesPath
    if (!fs.existsSync(dir)) return false
    const requiredDirectories = ["HeroesData", "Support", "Support64", "Versions"]
    const requiredFiles = [".patch.result", ".product.db", "Launcher.db"]

    const dirLists = fs.readdirSync(dir, { withFileTypes: true })

    let dCheck = 0
    let fCheck = 0

    for (dirList of dirLists) {
      if (requiredDirectories.includes(dirList.name) && dirList.isDirectory()) dCheck += 1
      if (requiredFiles.includes(dirList.name) && dirList.isFile()) fCheck += 1
    }

    if (dCheck !== requiredDirectories.length || fCheck !== requiredFiles.length) {
      console.log("Invalid Heroes Installation")
      return false
    }
    heroesInstallationPath = path.resolve(dir)
    return true

  }

  const promptHeroesInstallation = () => {

    const result = dialog.showOpenDialogSync(win, {
      properties: ['openDirectory'],
      title: "**Please select the Heroes of the Storm Installation Folder**"
    })

    if (result) {
      if (validateHeroesInstallation(result[0])) {
        return { "error": false, "msg": result[0] }
      } else {
        return { "error": true, "msg": "Invalid Heroes Installation" }
      }
    } else {
      console.log("Operation Cancelled")
      return { "error": true, "msg": "Operation Cancelled" }
    }

  }


  ipcMain.on('validateHeroesInstallation', (event, args) => {
    event.returnValue = validateHeroesInstallation(args) ? heroesInstallationPath : false
  })



  ipcMain.on('getHeroesInstallationPath', event => {
    event.returnValue = promptHeroesInstallation()
  })

  ipcMain.on("applyOnlineMap", (event, args) => {
    // Ask once
    const { data: mapBinary, type, name, id } = args

    if (!heroesInstallationPath) {
      let result = promptHeroesInstallation()
      if (result.error) return event.returnValue = result
    }
    try {
      const mapPath = heroesInstallationPath + "/" + config.heroes.mapsPath[type].path
      const mapFilename = config.heroes.mapsPath[type].file
      // Create Folder
      mkdirp.sync(mapPath)

      // If Map file already exists then rename the old one
      if (fs.existsSync(path.resolve(mapPath) + "/" + mapFilename)) {
        fs.renameSync(path.resolve(mapPath) + "/" + mapFilename, path.resolve(mapPath) + "/" + `backup-${+new Date()}-${mapFilename}`)
      }

      // Write File
      fs.writeFileSync(path.resolve(mapPath) + "/" + mapFilename, Buffer.from(mapBinary))

      // Return Message
      event.returnValue = { error: false }


    } catch (e) {
      console.log(e)
      return event.returnValue = { error: true, msg: e.message }
    }

  })

  ipcMain.on("getInstalledMaps", event => {
    if (!heroesInstallationPath) {
      let result = promptHeroesInstallation()
      if (result.error) return event.returnValue = result
    }

    const exist = []
    for (type of Object.keys(config.heroes.mapsPath)) {

      const mapPath = heroesInstallationPath + "/" + config.heroes.mapsPath[type].path
      const mapFilename = config.heroes.mapsPath[type].file

      if (fs.existsSync(path.resolve(mapPath) + "/" + mapFilename)) {
        exist.push(type)
      }

    }

    event.returnValue = exist

  })

  ipcMain.on("removeInstalledMaps", (event, args) => {
    const mapPath = heroesInstallationPath + "/" + config.heroes.mapsPath[args.type].path
    const mapFilename = config.heroes.mapsPath[args.type].file

    if (fs.existsSync(path.resolve(mapPath) + "/" + mapFilename)) {
      if (args.delete) {
        fs.unlinkSync(path.resolve(mapPath) + "/" + mapFilename, path.resolve(mapPath) + "/" + `backup-${+new Date()}-${mapFilename}`)
      } else {
        fs.renameSync(path.resolve(mapPath) + "/" + mapFilename, path.resolve(mapPath) + "/" + `backup-${+new Date()}-${mapFilename}`)
      }
      event.returnValue = { error: false }
    } else {
      event.returnValue = { error: true, msg: "Unable to find " + mapFilename }

    }
  })

  ipcMain.on("getSettings", event => {
    if (heroesInstallationPath) {
      event.returnValue = {
        heroesInstallPath: heroesInstallationPath
      }
    } else {
      event.returnValue = false
    }
  })


}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
