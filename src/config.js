const gitUser = "jamiephan"
const gitRepo = "HeroesOfTheStorm_TryMode2.0"


module.exports = {
  git: {
    user: gitUser,
    repo: gitRepo,
    url: {
      api: {
        release: `https://api.github.com/repos/${gitUser}/${gitRepo}/releases/latest`
      }
    }
  },
  heroes: {
    mapsPath: {
      trymode: {
        name: "Try Mode",
        path: "/maps/heroes/singleplayermaps/",
        file: "(10)trymemode.stormmap"
      },
      beginner: {
        name: "Tutorial: Beginner",
        path: "/maps/heroes/singleplayermaps/startingexperience",
        file: "tutorial01.stormmap"
      },
      mapmechanic: {
        name: "Tutorial: Map Mechanic",
        path: "/maps/heroes/singleplayermaps/startingexperience",
        file: "tutorialmapmechanics.stormmap"
      },
      veteran: {
        name: "Tutorial: Veteran",
        path: "/maps/heroes/singleplayermaps/startingexperience",
        file: "tutorialveteran.stormmap"
      },
    }
  }
}