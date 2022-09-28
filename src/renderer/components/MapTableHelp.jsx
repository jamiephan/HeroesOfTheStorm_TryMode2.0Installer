import React, { useContext } from 'react';
import { Alert } from 'react-bootstrap';
import GlobalContext from '../context/GlobalContext';
import ElectronLink from './shared/ElectronLink';
import config from '../../../config';

export default function MapTableHelp() {
  const { dispatch } = useContext(GlobalContext);

  return (
    <>
      <Alert
        dismissible
        onClose={() =>
          dispatch({
            type: 'SET_SETTINGS',
            showMapInstallDescription: false,
          })
        }
      >
        <p>
          This section allows you to install the map from{' '}
          <ElectronLink href="https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0">
            Try Mode 2.0
          </ElectronLink>{' '}
          (
          <ElectronLink href="https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases/latest">
            GitHub Release
          </ElectronLink>
          ) directly without manually download and install it yourself.
        </p>
        <p>
          Select one of the map you would like to download and install (Maps
          with <b>(AI)</b> in the name indicates it will populate with AI
          players).
        </p>
        <ul>
          {/* config.heroes.mapsPath */}
          {Object.keys(config.heroes.mapsPath).map((v) => {
            const obj = config.heroes.mapsPath[v];
            return (
              <li key={v}>
                <code>{obj.name}</code>: {obj.description.text}{' '}
                {obj.description.inGamePath && (
                  <ul>
                    <li>
                      The map can be launched in game via: &nbsp;
                      <code>{obj.description.inGamePath.join(' -> ')}</code>
                    </li>
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <p>
          You can also click on &quot;Run&quot; to run the map directly without
          overriding the maps above. However there will be some issues such as
          talents not loading.
        </p>
      </Alert>
    </>
  );
}
