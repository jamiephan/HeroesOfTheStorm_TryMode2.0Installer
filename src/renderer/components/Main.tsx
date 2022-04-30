import React, { useContext } from 'react';
import GlobalContext from 'renderer/context/GlobalContext';
import Config from './Config';
import InstalledMaps from './InstalledMaps';
import MapTable from './MapTable';
import MapTableHelp from './MapTableHelp';
import OpenFolderButton from './OpenFolderButton';
import AlertDialog from './shared/AlertDialog';

export default function Main() {
  const { state } = useContext(GlobalContext);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* <h1>{state?.settings?.appName}</h1>
      <p>
        <span>Thank you~~</span>
      </p> */}
      <Config />
      {/* <Button onClick={handleClick}>Click</Button> */}
      {state?.settings?.heroesPath && (
        <>
          {state?.settings?.installedMaps &&
            state?.settings?.installedMaps.length > 0 && (
              <>
                <h3>Overrode Maps:</h3>
                <InstalledMaps />
              </>
            )}
          <h3>Map Installation:</h3>
          <MapTableHelp />
          <MapTable />
        </>
      )}
      <AlertDialog />
    </div>
  );
}
