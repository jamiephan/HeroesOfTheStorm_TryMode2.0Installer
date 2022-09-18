const gitUser = 'jamiephan';
const gitRepo = 'HeroesOfTheStorm_TryMode2.0';

module.exports = {
  git: {
    user: gitUser,
    repo: gitRepo,
    url: {
      api: {
        release: `https://api.github.com/repos/${gitUser}/${gitRepo}/releases/latest`,
      },
    },
  },
  heroes: {
    mapsPath: {
      trymode: {
        name: 'Try Mode',
        path: '/maps/heroes/singleplayermaps/',
        file: '(10)trymemode.stormmap',
        description: {
          text: 'The map can be launched When entering Try Mode in Heroes of the Storm.',
          inGamePath: null,
        },
      },
      beginner: {
        name: 'Tutorial: Beginner',
        path: '/maps/heroes/singleplayermaps/startingexperience',
        file: 'tutorial01.stormmap',
        description: {
          text: 'Beginner Tutorial.',
          inGamePath: ['Settings', 'Tutorials', 'Tutorial'],
        },
      },
      mapmechanic: {
        name: 'Tutorial: Map Mechanic',
        path: '/maps/heroes/singleplayermaps/startingexperience',
        file: 'tutorialmapmechanics.stormmap',
        description: {
          text: 'Battleground Training.',
          inGamePath: ['Settings', 'Tutorials', 'Battleground Training'],
        },
      },
      veteran: {
        name: 'Tutorial: Veteran',
        path: '/maps/heroes/singleplayermaps/startingexperience',
        file: 'tutorialveteran.stormmap',
        description: {
          text: 'Veteran Introduction.',
          inGamePath: ['Settings', 'Challenges', 'Veteran Intoduction'],
        },
      },
    },
  },
};
