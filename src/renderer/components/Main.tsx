import React, { useContext } from 'react';
import GlobalContext from 'renderer/context/GlobalContext';
import Config from './Config';
import InstalledMaps from './InstalledMaps';
import MapTable from './MapTable';
import MapTableHelp from './MapTableHelp';
import AlertDialog from './shared/AlertDialog';
import StormMapGenerator from './StormMapGenerator';

export default function Main() {
  const { state } = useContext(GlobalContext);

  return (
    <div style={{ paddingTop: '80px' }} className="mainBody">
      <Config />
      {state?.settings?.heroesPath && (
        <>
          {state?.settings?.installedMaps &&
            state?.settings?.installedMaps.length > 0 && (
              <>
                <h3>Overrode Maps:</h3>
                <InstalledMaps />
              </>
            )}
          {state?.settings?.showStormMapGenerator && <StormMapGenerator />}
          <h3>Map Installation:</h3>
          <MapTableHelp />
          <MapTable />
        </>
      )}
      <AlertDialog />
    </div>
  );
}
