import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import GlobalContext from '../context/GlobalContext';

export default function OpenFolderButton(props) {
  const { dispatch } = useContext(GlobalContext);
  return (
    <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
      onClick={() => dispatch({ type: 'OPEN_FOLDER', path: props.path })}
      {...props}
    />
  );
}
