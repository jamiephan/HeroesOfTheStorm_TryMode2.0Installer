import React, { useContext } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import config from '../../../config';
import GlobalContext from '../context/GlobalContext';
import ElectronLink from './shared/ElectronLink';

export default function StormMapGenerator() {
  const { dispatch, state } = useContext(GlobalContext);

  return (
    <>
      <h3>Storm Map Generator:</h3>
      <Alert>
        <p>
          This section allows you to generate your custom map from{' '}
          <ElectronLink href="https://stormmap.herokuapp.com/">
            Storm Map Generator
          </ElectronLink>{' '}
          (
          <ElectronLink href="https://github.com/jamiephan/HeroesOfTheStorm_StormMapGenerator">
            Source Code
          </ElectronLink>
          ) and install it directly to the game modes without manually download
          and install it.
        </p>
      </Alert>
      <Table bordered>
        <thead style={{ position: 'sticky' }}>
          <tr>
            {Object.keys(config.heroes.mapsPath).map((mapName) => (
              <th key={mapName} align="center" style={{ textAlign: 'center' }}>
                {config.heroes.mapsPath[mapName].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(config.heroes.mapsPath).map((mapName) => (
              <td key={mapName} align="center" style={{ textAlign: 'center' }}>
                {!state.settings.activeStormmapGeneratorWindow.includes(
                  config.heroes.mapsPath[mapName].name
                ) ? (
                  <Button
                    variant="primary"
                    onClick={() =>
                      dispatch({
                        type: 'OPEN_STORMMAP_GENERATOR',
                        config: config.heroes.mapsPath[mapName],
                      })
                    }
                  >
                    Launch
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() =>
                      dispatch({
                        type: 'CLOSE_STORMMAP_GENERATOR',
                        config: config.heroes.mapsPath[mapName],
                      })
                    }
                  >
                    Force Close
                  </Button>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </>
  );
}
