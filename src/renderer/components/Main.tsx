import { useContext } from 'react';
import GlobalContext from 'renderer/context/GlobalContext';
import Config from './Config';
import DrapAndDropArea from './DrapAndDropArea';
import InstalledMaps from './InstalledMaps';
import MapTable from './MapTable';
import AlertDialog from './shared/AlertDialog';
import StormMapGenerator from './StormMapGenerator';

export default function Main() {
  const { state } = useContext(GlobalContext);

  return (
    <div style={{ paddingTop: '80px' }} className="mainBody">
      <DrapAndDropArea
        enabled={
          state?.settings?.heroesPath &&
          !state?.dialog?.show &&
          !state?.isInstallingMap
        }
      >
        <h3>Configuration</h3>
        <Config />
        {state?.settings?.heroesPath && (
          <>
            {state?.settings?.installedMaps &&
              state?.settings?.installedMaps.length > 0 && (
                <>
                  <h3>Installed Maps</h3>
                  <InstalledMaps />
                </>
              )}
            {state?.settings?.showStormMapGenerator && (
              <>
                <h3>Storm Map Generator</h3>
                <StormMapGenerator />
              </>
            )}
            <h3>Download / Install</h3>
            <MapTable />
          </>
        )}
        <AlertDialog />
      </DrapAndDropArea>
    </div>
  );
}
