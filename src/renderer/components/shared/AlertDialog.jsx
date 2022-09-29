import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import GlobalContext from '../../context/GlobalContext';

export default function AlertDialog() {
  const { state, dispatch } = useContext(GlobalContext);

  const handleClose = () => dispatch({ type: 'HIDE_DIALOG' });
  const handleCancel = () =>
    dispatch({ type: 'HIDE_DIALOG', noCallback: true });
  return (
    <>
      <Modal show={state?.dialog?.show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{state?.dialog?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowWrap: 'break-word' }}>
          {state?.dialog?.message}
        </Modal.Body>
        <Modal.Footer>
          {state?.dialog?.withYesNo ? (
            <>
              <Button variant="primary" onClick={handleClose}>
                OK
              </Button>
              <Button variant="primary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={state?.isInstallingMap} centered>
        <Modal.Header>
          <Modal.Title>Installing Map...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Downloading and Installing{' '}
            <b>{state?.installMapConfig?.downloadPrettyName}</b> at{' '}
            <b>{state?.installMapConfig?.name}</b>.
          </p>
          <p>Please wait...</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
