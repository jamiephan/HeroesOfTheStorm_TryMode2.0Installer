import React, { useEffect, useState, useContext } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

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
  const [filterText, setFilterText] = useState(
    state?.settings?.mapFilterText || ''
  );
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    fetch(config.git.url.api.release)
      .then((res) => res.json())
      .then((res) => setApiResponse(res))
      .finally(() => setIsLoading(false))
      .catch(() => setIsError(true));
  }, []);

  useEffect(() => {
    if (!apiResponse && !apiResponse?.assets && !filterText) return;
    const assetList = apiResponse?.assets || [];
    const filtered = assetList.filter((a) =>
      a.name
        .toLowerCase()
        .replace(/[.]/g, '')
        .includes(filterText.toLowerCase().replace(/[. ()]/g, ''))
    );
    dispatch({
      type: 'SET_SETTINGS',
      mapFilterText: filterText,
    });
    setFilteredList(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterText, apiResponse]);

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
      <div style={{ minHeight: '500px' }}>
        <Table bordered>
          <thead style={{ position: 'sticky' }}>
            <tr>
              <th
                colSpan={
                  1 +
                  (state?.settings?.platform === 'win32' ? 1 : 0) +
                  Object.keys(config.heroes.mapsPath).length
                }
              >
                Latest Commit:{' '}
                <ElectronLink href={htmlUrl}>{commitMessage}</ElectronLink> (
                {getRelativeTime(timestamp)})
              </th>
            </tr>
            <tr>
              <th
                colSpan={
                  1 +
                  (state?.settings?.platform === 'win32' ? 1 : 0) +
                  Object.keys(config.heroes.mapsPath).length
                }
              >
                <div style={{ display: 'flex' }}>
                  <div style={{ alignSelf: 'center' }}>Filter:</div>
                  <div style={{ marginLeft: '20px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Alterac Pass"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>Map Name</th>
              {state?.settings?.platform === 'win32' && (
                <th align="center" style={{ textAlign: 'center' }}>
                  Run Directly
                </th>
              )}
              {Object.keys(config.heroes.mapsPath).map((mapName) => (
                <th
                  key={mapName}
                  align="center"
                  style={{ textAlign: 'center' }}
                >
                  {config.heroes.mapsPath[mapName].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((asset) => (
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
                {state?.settings?.platform === 'win32' && (
                  <td align="center">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        dispatch({
                          type: 'RUN_MAP',
                          config: {
                            downloadLink: asset.browser_download_url,
                            downloadName: asset.name,
                            downloadPrettyName:
                              asset.name
                                .replace('.stormmap', '')
                                .replace('.s', "'s")
                                .replace('.AI', '')
                                .replace(/\./g, ' ') +
                              (asset.name.endsWith('.AI.stormmap')
                                ? ' (AI)'
                                : ''),
                          },
                        })
                      }
                    >
                      Run
                    </Button>
                  </td>
                )}
                {Object.keys(config.heroes.mapsPath).map((mapName) => (
                  <td key={`${mapName}-${asset.name}`} align="center">
                    <Button
                      variant="primary"
                      disabled={state?.isInstallingMap}
                      onClick={() =>
                        dispatch({
                          type: 'INSTALL_MAP',
                          config: {
                            downloadLink: asset.browser_download_url,
                            ...config.heroes.mapsPath[mapName],
                            downloadName: asset.name,
                            downloadPrettyName:
                              asset.name
                                .replace('.stormmap', '')
                                .replace('.s', "'s")
                                .replace('.AI', '')
                                .replace(/\./g, ' ') +
                              (asset.name.endsWith('.AI.stormmap')
                                ? ' (AI)'
                                : ''),
                          },
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
      </div>
    );
  }

  return html;
}
