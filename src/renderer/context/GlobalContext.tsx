import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const GlobalReducer = (
  state: Record<string, any>,
  action: Record<string, unknown>
) => {
  const { type, ...payload } = action;

  switch (type) {
    case 'FETCH_SETTINGS':
      window.electron.ipcRenderer.getSettings();
      return {
        ...state,
      };

    case 'SET_SETTINGS':
      // Object.keys(payload).forEach((key) => {
      window.electron.ipcRenderer.setSettings({
        ...state.settings,
        ...payload,
      });
      // });
      return {
        ...state,
      };

    case 'APPLY_SETTINGS_FROM_IPC':
      return {
        ...state,
        ...payload,
      };

    case 'OPEN_ELECTRON_HEROES_INSTALL_DIALOG':
      window.electron.ipcRenderer.openHeroesInstallDialog();
      return {
        ...state,
      };

    case 'SHOW_DIALOG':
      return {
        ...state,
        dialog: {
          show: true,
          message: payload.message,
          title: payload.title,
          callback: payload?.callback || (() => {}),
        },
      };
    case 'HIDE_DIALOG':
      // eslint-disable-next-line react/destructuring-assignment
      state.dialog.callback();
      return {
        ...state,
        dialog: {
          show: false,
          message: null,
          title: null,
          callback: null,
        },
      };
    case 'INSTALL_MAP':
      window.electron.ipcRenderer.installMap(payload.config);
      return {
        ...state,
        isInstallingMap: true,
        installMapConfig: payload.config,
      };
    case 'RUN_MAP':
      window.electron.ipcRenderer.runMap(payload.config);
      return {
        ...state,
      };
    case 'FINISHED_INSTALL_MAP':
      return {
        ...state,
        isInstallingMap: false,
        installMapConfig: {},
      };
    case 'CLOSE_APP_WINDOW':
      window.electron.ipcRenderer.closeWindow();
      return {
        ...state,
      };
    case 'OPEN_FOLDER':
      window.electron.ipcRenderer.openFolder(payload.path);
      return {
        ...state,
      };
    case 'APPLY_INSTALLED_MAPS_FROM_IPC':
      return {
        ...state,
        installedMaps: payload.maps,
      };
    case 'DELETE_INSTALLED_MAP':
      window.electron.ipcRenderer.deleteInstalledMap(payload.map);
      return {
        ...state,
      };
    case 'RUN_INSTALLED_MAP':
      window.electron.ipcRenderer.runInstalledMap(payload.map);
      return {
        ...state,
      };
    case 'OPEN_STORMMAP_GENERATOR':
      window.electron.ipcRenderer.openStormMapGenerator(payload.config);
      return {
        ...state,
      };
    case 'CLOSE_STORMMAP_GENERATOR':
      window.electron.ipcRenderer.closeStormMapGenerator(payload.config);
      return {
        ...state,
      };
    default:
      return state;
  }
};

const context = React.createContext({});

function GlobalContext({ children }) {
  const [state, dispatch] = React.useReducer(GlobalReducer, {});

  useEffect(() => {
    dispatch({ type: 'FETCH_SETTINGS' });
    window.electron.ipcRenderer.on('get-settings', (arg) => {
      dispatch({ type: 'APPLY_SETTINGS_FROM_IPC', settings: arg });
    });

    window.electron.ipcRenderer.on('electron-ipc-error', (message) => {
      dispatch({
        type: 'SHOW_DIALOG',
        title: 'Error',
        message,
      });
    });

    window.electron.ipcRenderer.on('electron-ipc-success', (message) => {
      dispatch({
        type: 'SHOW_DIALOG',
        title: 'Success',
        message,
      });
    });

    window.electron.ipcRenderer.on('finish-install-map', (result) => {
      dispatch({
        type: 'FINISHED_INSTALL_MAP',
      });

      dispatch({
        type: 'SHOW_DIALOG',
        title: `Map Installation ${result.success ? 'Successful' : 'Failed'}`,
        message: result.message,
      });

      window.electron.ipcRenderer.on('get-installed-maps', (arg) => {
        dispatch({ type: 'APPLY_INSTALLED_MAPS_FROM_IPC', maps: arg });
      });
    });
  }, []);

  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
}

GlobalContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default context;
export const Provider = GlobalContext;
