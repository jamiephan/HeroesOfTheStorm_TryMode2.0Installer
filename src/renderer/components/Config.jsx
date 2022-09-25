import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';

import GlobalContext from '../context/GlobalContext';
import ConfigEntry from './shared/ConfigEntry';

export default function Config() {
  const { state, dispatch } = useContext(GlobalContext);

  return (
    <>
      <h3>Configuration:</h3>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Description</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* heroesPath */}
          <ConfigEntry
            description="The path of Heroes of the Storm."
            settingKey="heroesPath"
            required
            type="custom"
            customActions={[
              {
                text: 'Modify',
                action: () =>
                  dispatch({
                    type: 'OPEN_ELECTRON_HEROES_INSTALL_DIALOG',
                  }),
              },
            ]}
          />
          {/* skipHeroesPathCheck */}
          <ConfigEntry
            description="Skip the check for selecting Heroes of the Storm Path."
            settingKey="skipHeroesPathCheck"
          />
          {/* showMapInstallDescription */}
          <ConfigEntry
            description="Show the description box in the Map Install section."
            settingKey="showMapInstallDescription"
          />
          {/* showStormMapGenerator */}
          <ConfigEntry
            description="Show the Storm Map Generator Config Section."
            settingKey="showStormMapGenerator"
          />
        </tbody>
      </Table>
    </>
  );
}
