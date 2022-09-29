import React, { useContext } from 'react';
import { Button, ButtonGroup, Table } from 'react-bootstrap';
import config from '../../../config';
import GlobalContext from '../context/GlobalContext';

export default function InstalledMaps() {
  const {
    dispatch,
    state: {
      settings: { installedMaps, showConfirmDeletedMap },
    },
  } = useContext(GlobalContext);
  return (
    <Table style={{ maxWidth: '50%' }}>
      <thead>
        <tr>
          <th>Name</th>
          {/* <th>Path</th> */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(config.heroes.mapsPath)
          .filter((x) => installedMaps.includes(x))
          .map((map) => (
            <tr key={map}>
              <td>{config.heroes.mapsPath[map].name}</td>
              {/* <td>
                <code>
                  {config.heroes.mapsPath[map].path +
                    config.heroes.mapsPath[map].file}
                </code>
              </td> */}
              <td>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    onClick={() => dispatch({ type: 'RUN_INSTALLED_MAP', map })}
                  >
                    Run
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch({ type: 'OPEN_INSTALLED_MAP', map });
                    }}
                  >
                    Locate
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (showConfirmDeletedMap) {
                        dispatch({
                          type: 'SHOW_DIALOG',
                          title: `Confirm delete custom ${config.heroes.mapsPath[map].name}?`,
                          withYesNo: true,
                          message: `Are you sure you want to delete the custom installed ${config.heroes.mapsPath[map].name}? This will revert to the default in game map.`,
                          callback: () => {
                            dispatch({ type: 'DELETE_INSTALLED_MAP', map });
                          },
                        });
                      } else {
                        dispatch({ type: 'DELETE_INSTALLED_MAP', map });
                      }
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
