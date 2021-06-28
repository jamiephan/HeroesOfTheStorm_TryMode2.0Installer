// Script in the Electron environment, similar to browser

const { ipcRenderer } = require('electron')
const config = require("./config")


const populateOnlineMaps = () => {

  document.getElementById("downloadmap").classList.add("faded")
  const tbody = document.querySelector("#downloadmap > tbody")

  tbody.innerHTML = ""

  fetch(config.git.url.api.release)
    .then(r => r.json())
    .then(j => {

      const { name: commitMessage, published_at: timestamp, assets, tag_name, html_url } = j


      assets.forEach(asset => {
        const tr = document.createElement("tr")

        const { browser_download_url: link, name: mapId } = asset
        const mapName = mapId
          .replace(".stormmap", "")
          .replace(/\.s/g, "'s")
          .replace(/\./g, " ")
        const linkTd = document.createElement("td")
        linkTd.innerText = mapName

        tr.appendChild(linkTd)

        for (type of Object.keys(config.heroes.mapsPath)) {
          const typeTd = document.createElement("td")
          const typeBtn = document.createElement("button")
          typeBtn.innerText = "Apply"
          typeBtn.dataset.link = link
          typeBtn.dataset.type = type
          typeBtn.dataset.name = mapName
          typeBtn.dataset.id = mapId
          typeBtn.addEventListener("click", e => {
            applyOnlineMap(e.target.dataset)
          }, false)

          typeTd.appendChild(typeBtn)

          tr.appendChild(typeTd)
        }


        tbody.appendChild(tr)
      });

      document.getElementById("commitheader").innerHTML = `Commit: ${commitMessage} (<a href="${html_url}" target="_blank">${tag_name}</a>)`

      document.getElementById("downloadmap").classList.remove("faded")


    })
}


window.addEventListener('DOMContentLoaded', () => {

  // Check LocalStorage for Heroes Path
  if (localStorage.getItem("HeroesInstallPath")) {
    let result = ipcRenderer.sendSync('validateHeroesInstallation', localStorage.getItem("HeroesInstallPath"))
    console.log(result)
    if (result) {
      updateSettings()
      populateInstalledMaps()
    } else {
      document.getElementById("heroespath").innerText = "Please Select the Heroes of the Storm Installation Folder"
    }
  }

  // Load online maps
  populateOnlineMaps()
  // Load online maps when relaod button clicked
  document.getElementById("reloaddownloadmap").addEventListener("click", populateOnlineMaps)

  document.getElementById("reloadinstalledmap").addEventListener("click", populateInstalledMaps)

  // Settings Heroes Path button clicked
  document.getElementById("settings-heroespath").addEventListener("click", () => {

    const result = ipcRenderer.sendSync('getHeroesInstallationPath')

    if (result.error) {
      // Error
      alert(result.msg)
    } else {
      updateSettings()
      populateInstalledMaps()
    }

  })
})



// Apply button clicked
const applyOnlineMap = (data) => {
  const { link, type, name, id } = data
  // alert(id)

  fetch(link)
    .then(d => d.arrayBuffer())
    .then(d => {
      if (confirm("Apply map to " + type + "? (This will override existing map)")) {
        const result = ipcRenderer.sendSync('applyOnlineMap', { data: d, type, name, id })
        if (!result.error) {
          alert(`Applied ${name} to ${type}. Try launch it in the game!`)
          populateInstalledMaps()
          updateSettings()
        } else {
          alert(`Error when applied the map. ${result.msg}`)
        }
      }
    })
  alert("Downloading " + name)

  // Dataset cannot be converted to IPC-able object
}

const populateInstalledMaps = () => {
  const ul = document.getElementById("installedList")
  ul.innerHTML = ""

  const result = ipcRenderer.sendSync('getInstalledMaps')

  if (result) {
    result.forEach(type => {
      const li = document.createElement("li")
      const name = config.heroes.mapsPath[type].name
      const removeBtn = document.createElement("button")
      removeBtn.dataset.type = type
      removeBtn.innerText = "Remove"
      removeBtn.addEventListener("click", e => {
        removeInstalledMap({ type: e.target.dataset.type, delete: false })
      })

      const deleteBtn = document.createElement("button")
      deleteBtn.dataset.type = type
      deleteBtn.innerText = "Delete"
      deleteBtn.addEventListener("click", e => {
        removeInstalledMap({ type: e.target.dataset.type, delete: true })
      })

      li.innerText = name
      li.innerHTML += "&nbsp;&nbsp;"
      li.appendChild(removeBtn)
      li.innerHTML += "&nbsp;&nbsp;"
      li.appendChild(deleteBtn)
      ul.appendChild(li)
    })

    updateSettings()
  } else {
    alert("Unable to get installed Maps")
  }
}

const removeInstalledMap = type => {
  const result = ipcRenderer.sendSync('removeInstalledMaps', type)
  if (result.error) {
    alert(e.msg)
  } else {
    populateInstalledMaps()
  }
}

const updateSettings = () => {
  const result = ipcRenderer.sendSync('getSettings')
  if (result) {
    document.getElementById("heroespath").innerText = result.heroesInstallPath
    localStorage.setItem("HeroesInstallPath", result.heroesInstallPath)
    return true
  } else {
    return false
  }
}