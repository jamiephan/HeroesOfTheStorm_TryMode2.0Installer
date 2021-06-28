// Scripts run before electron renders.
// Have access to windows, document and nodejs, e.g process

// const config = require("./config")

// window.config = config

window.addEventListener('DOMContentLoaded', () => {
  


  // fetch(config.git.url.api.release)
  //   .then(r => r.json())
  //   .then(j => {

  //     const tbody = document.querySelector("#downloadmap > tbody")

  //     const { name: commitMessage, published_at: timestamp, assets } = j


  //     assets.forEach(asset => {
  //       const tr = document.createElement("tr")

  //       const { browser_download_url: link, name: mapId } = asset
  //       const mapName = mapId
  //           .replace(".stormmap", "")
  //           .replace(/\.s/g, "'s")
  //           .replace(/\./g, " ")
  //       const linkTd = document.createElement("td")
  //       linkTd.innerText = mapName

  //       tr.appendChild(linkTd)

  //       for (type of ["trymode", "beginner", "mapmechanic", "veteran"]) {
  //         const typetd = document.createElement("td")
  //         const typebtn = document.createElement("button")
  //         typebtn.innerText = "Apply"
  //         typebtn.dataset.link = link
  //         typebtn.dataset.type = type
  //         typebtn.dataset.name = mapName
  //         typebtn.dataset.id = mapId
  //         typebtn.addEventListener("click", e => {
  //           // alert(this.dataset)
  //           applyOnlineMap(e.target.dataset)
  //         }, false)

  //         typetd.appendChild(typebtn)

  //         tr.appendChild(typetd)
  //       }

  //       tbody.appendChild(tr)
  //     });

  //     document.getElementById("downloadmap").classList.remove("faded")
  //   })
})



// const applyOnlineMap = (data) => {
//   const {link, type, name, id} = data
//   alert(id)
// }