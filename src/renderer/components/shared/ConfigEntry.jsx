import React, { useContext } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import GlobalContext from '../../context/GlobalContext';

export default function ConfigEntry({
  type = 'bool',
  settingKey = '',
  description = '',
  required = false,
  customActions = [],
}) {
  const { state, dispatch } = useContext(GlobalContext);
  let valueString;
  let actions;

  switch (type) {
    case 'bool':
      valueString = state?.settings?.[settingKey] ? 'true' : 'false';
      actions = [
        {
          text: 'Toggle',
          action: () =>
            dispatch({
              type: 'SET_SETTINGS',
              [settingKey]: !state?.settings?.[settingKey],
            }),
        },
      ];
      break;
    case 'custom':
      valueString = String(state?.settings?.[settingKey]);
      actions = customActions;
      break;
    default:
      valueString = String(state?.settings?.[settingKey]);
      break;
  }

  return (
    <tr>
      <td>{settingKey}</td>
      <td>
        {description} <b>({required ? 'Required*' : 'Optional'})</b>
      </td>
      <td>
        <code>{valueString}</code>
      </td>
      <td>
        <ButtonGroup>
          {actions.map((x, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Button key={i} variant={x?.variant} onClick={x?.action}>
              {x?.text}
            </Button>
          ))}
        </ButtonGroup>
      </td>
    </tr>
  );
}
