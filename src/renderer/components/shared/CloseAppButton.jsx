import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import GlobalContext from '../../context/GlobalContext';

export default function CloseAppButton(props) {
  const { dispatch } = useContext(GlobalContext);

  return (
    <Button
      variant="danger"
      onClick={() => dispatch({ type: 'CLOSE_APP_WINDOW' })}
      {...props}
    />
  );
}
