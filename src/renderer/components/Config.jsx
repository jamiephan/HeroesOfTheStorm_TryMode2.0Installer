import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';

import GlobalContext from '../context/GlobalContext';
import ConfigEntry from './shared/ConfigEntry';

export default function Config() {
  const { state, dispatch } = useContext(GlobalContext);

  return (
    <>
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
          {/* showStormMapGenerator */}
          <ConfigEntry
            description="Show the Storm Map Generator Config Section."
            settingKey="showStormMapGenerator"
          />
          {/* More Settings... */}
          {state?.settings?.showMoreSettings && (
            <>
              {/* skipHeroesPathCheck */}
              <ConfigEntry
                description="Skip the check for selecting Heroes of the Storm Path."
                settingKey="skipHeroesPathCheck"
              />
              {/* showStormMapGeneratorDescription */}
              <ConfigEntry
                description="Show the description box in the Storm Map Generator."
                settingKey="showStormMapGeneratorDescription"
              />
              {/* showMapInstallDescription */}
              <ConfigEntry
                description="Show the description box in the Map Install section."
                settingKey="showMapInstallDescription"
              />
              {/* showConfirmDeletedMap */}
              <ConfigEntry
                description="Shows a Confirm Dialog before delete/overriding current local maps."
                settingKey="showConfirmDeletedMap"
              />
            </>
          )}
        </tbody>
      </Table>

      {/* Show More */}
      <div style={{ overflow: 'auto' }}>
        <Button
          variant="secondary"
          style={{ float: 'right' }}
          onClick={() =>
            dispatch({
              type: 'SET_SETTINGS',
              showMoreSettings: !state?.settings?.showMoreSettings,
            })
          }
        >
          {state?.settings?.showMoreSettings ? 'Less' : 'More'} Options
        </Button>
      </div>
    </>
  );
}
