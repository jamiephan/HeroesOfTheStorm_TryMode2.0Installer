import React, { useEffect, useState, useContext } from 'react';
import { Button, Table } from 'react-bootstrap';

import config from '../../../config';
import ElectronLink from './shared/ElectronLink';
import GlobalContext from '../context/GlobalContext';

const getRelativeTime = (date) => {
  const diff = new Date(date) - new Date();
  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const u in units) {
    if (Math.abs(diff) > units[u] || u == 'second') {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        Math.round(diff / units[u]),
        u
      );
    }
  }
};

export default function MapTable() {
  const { state, dispatch } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(config.git.url.api.release)
      .then((res) => res.json())
      .then((res) => setApiResponse(res))
      .finally(() => setIsLoading(false))
      .catch(() => setIsError(true));
  }, []);

  const installMap = (mapConfig) => {
    dispatch({ type: 'INSTALL_MAP', config: mapConfig });
    // const {
    //   downloadLink,
    //   downloadName,
    //   downloadPrettyName,
    //   name,
    //   path,
    //   file,
    //   e,
    // } = mapConfig;

    // setIsInstalling(true);
    // e.target.innerText = 'Installing...';
    // window.electron.ipcRenderer.installMap();
    // // setTimeout(() => {
    // // }, 2000);
    // // Install
    // e.target.innerText = 'Install';
    // setIsInstalling(false);
    // e.target.disabled = true;
    // // console.log(e.target);
    // alert(downloadPrettyName);
    // e.target.disabled = false;
  };

  let html = null;

  if (isLoading) {
    html = <p>Loading...</p>;
  } else if (isError) {
    html = <p>Error</p>;
  } else {
    const {
      name: commitMessage,
      published_at: timestamp,
      assets,
      tag_name: tagName,
      html_url: htmlUrl,
    } = apiResponse;

    html = (
      <Table bordered>
        <thead style={{ position: 'sticky' }}>
          <tr>
            <th colSpan="5">
              Latest Commit:{' '}
              <ElectronLink href={htmlUrl}>{commitMessage}</ElectronLink> (
              {getRelativeTime(timestamp)})
            </th>
          </tr>
          <tr>
            <th>Map Name</th>
            {Object.keys(config.heroes.mapsPath).map((mapName) => (
              <th key={mapName}>{config.heroes.mapsPath[mapName].name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.name}>
              <td>
                {asset.name
                  .replace('.stormmap', '')
                  .replace('.s', "'s")
                  .replace('.AI', '')
                  .replace(/\./g, ' ')}
                {asset.name.endsWith('.AI.stormmap') && (
                  <>
                    {' '}
                    <b>(AI)</b>
                  </>
                )}
              </td>
              {Object.keys(config.heroes.mapsPath).map((mapName) => (
                <td key={`${mapName}-${asset.name}`}>
                  <Button
                    variant="secondary"
                    disabled={state?.isInstallingMap}
                    onClick={(e) =>
                      installMap({
                        downloadLink: asset.browser_download_url,
                        ...config.heroes.mapsPath[mapName],
                        downloadName: asset.name,
                        downloadPrettyName:
                          asset.name
                            .replace('.stormmap', '')
                            .replace('.s', "'s")
                            .replace('.AI', '')
                            .replace(/\./g, ' ') +
                          (asset.name.endsWith('.AI.stormmap') ? ' (AI)' : ''),
                      })
                    }
                  >
                    Install
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return html;
}