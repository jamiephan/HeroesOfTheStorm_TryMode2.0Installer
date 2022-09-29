/* eslint-disable react/jsx-props-no-spreading */
import { useRef, useContext, useEffect } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import GlobalContext from 'renderer/context/GlobalContext';
import { CSSTransition } from 'react-transition-group';
import config from '../../../config';

interface IDrapAndDropArea {
  enabled: boolean;
  children: JSX.Element[] | JSX.Element;
}

export default function DrapAndDropArea({
  children,
  enabled,
}: IDrapAndDropArea) {
  const nodeRef = useRef(null);

  const { getRootProps, isDragActive } = useDropzone({
    disabled: !enabled,
    noClick: true,
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/octet-stream': ['.stormmap', '.sc2map'],
    },
  });

  // useEffect(() => {
  //   document.body.style.overflow = isDragActive ? 'hidden' : 'initial';
  // }, [isDragActive]);

  const { dispatch, state } = useContext(GlobalContext);

  const handleFileDrop = (files: File[], map) => {
    const mapObj = config.heroes.mapsPath[map];
    if (!files.length) {
      return dispatch({
        type: 'SHOW_DIALOG',
        title: 'Invalid File',
        message:
          'The file you selected are invalid. It must be a .stommap / .sc2map file and should only selected a single file.',
      });
    }

    const file = files[0];

    if (!file.size || !file.name || !file.path) {
      return dispatch({
        type: 'SHOW_DIALOG',
        title: 'Invalid File',
        message:
          'The file you selected are invalid. Please check if your file is corrupted.',
      });
    }

    if (
      state?.settings?.installedMaps?.includes(map) &&
      state?.settings?.showConfirmDeletedMap
    ) {
      dispatch({
        type: 'SHOW_DIALOG',
        title: `Override ${file.name} to ${mapObj.name}?`,
        withYesNo: true,
        message: `Are you sure you want to install ${file.name} to ${mapObj.name}? This will override existing installed custom map.`,
        callback: () => {
          dispatch({
            type: 'INSTALL_MAP_FROM_FILE',
            config: {
              map: mapObj,
              filePath: file.path,
            },
          });
        },
      });
    } else {
      dispatch({
        type: 'INSTALL_MAP_FROM_FILE',
        config: {
          map: mapObj,
          filePath: file.path,
        },
      });
    }
  };

  return (
    <div {...getRootProps()}>
      <CSSTransition
        in={isDragActive}
        nodeRef={nodeRef}
        timeout={200}
        classNames="overlay"
        unmountOnExit
      >
        <div ref={nodeRef} className="overlay">
          <div className="overlay-content center">
            <h1>Drop and install your custom map below:</h1>
            <div className="wrapper">
              {Object.keys(config.heroes.mapsPath).map((map, i) => (
                <Dropzone
                  key={map}
                  onDrop={(f) => handleFileDrop(f, map)}
                  noClick
                  maxFiles={1}
                  multiple={false}
                  accept={{
                    'application/octet-stream': ['.stormmap', '.sc2map'],
                  }}
                >
                  {({
                    getRootProps: getRootPropsChild,
                    getInputProps: getInputPropsChild,
                    isDragActive: isDragActiveChild,
                  }) => (
                    <div
                      {...getRootPropsChild()}
                      className={`draggable-items ${
                        isDragActiveChild ? 'draggable-items-hover' : ''
                      }`}
                    >
                      <input {...getInputPropsChild()} />
                      <h5>
                        {config.heroes.mapsPath[map].name}{' '}
                        {state?.settings?.installedMaps?.includes(map) && (
                          <code>(override*)</code>
                        )}
                      </h5>
                    </div>
                  )}
                </Dropzone>
              ))}
            </div>
          </div>
        </div>
      </CSSTransition>
      {children}
    </div>
  );
}
