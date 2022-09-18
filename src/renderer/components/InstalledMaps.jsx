import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import config from '../../../config';
import GlobalContext from '../context/GlobalContext';

export default function InstalledMaps() {
  const {
    dispatch,
    state: {
      settings: { installedMaps },
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
                <Button
                  variant="secondary"
                  onClick={() => dispatch({ type: 'RUN_INSTALLED_MAP', map })}
                >
                  Run
                </Button>
                <Button
                  variant="danger"
                  style={{ marginLeft: '20px' }}
                  onClick={() =>
                    dispatch({ type: 'DELETE_INSTALLED_MAP', map })
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
