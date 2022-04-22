import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';

import GlobalContext from '../context/GlobalContext';

export default function Config() {
  const { state, dispatch } = useContext(GlobalContext);

  return (
    <>
      <h3>Configuration:</h3>
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>heroesPath</td>
            <td>
              <code>{state?.settings?.heroesPath || 'null'}</code>
            </td>
            <td>
              The path of Heroes of the Storm. <b>(Required*)</b>
            </td>
            <td>
              <Button
                onClick={() =>
                  dispatch({ type: 'OPEN_ELECTRON_HEROES_INSTALL_DIALOG' })
                }
              >
                Modify
              </Button>
            </td>
          </tr>
          <tr>
            <td>skipHeroesPathCheck</td>
            <td>
              <code>
                {state?.settings?.skipHeroesPathCheck ? 'true' : 'false'}
              </code>
            </td>
            <td>
              Skip the check for selecting Heroes of the Storm Path.{' '}
              <b>(Optional)</b>
            </td>
            <td>
              <Button
                onClick={() =>
                  dispatch({
                    type: 'SET_SETTINGS',
                    skipHeroesPathCheck: !state?.settings?.skipHeroesPathCheck,
                  })
                }
              >
                Toggle
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
