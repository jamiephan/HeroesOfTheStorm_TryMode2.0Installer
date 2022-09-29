import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    getSettings() {
      ipcRenderer.send('get-settings');
    },
    setSettings(settings: Object) {
      ipcRenderer.send('set-settings', settings);
    },
    openHeroesInstallDialog() {
      ipcRenderer.send('open-heroes-install-dialog');
    },
    closeWindow() {
      ipcRenderer.send('close-window');
    },
    installMap(settings: Object) {
      ipcRenderer.send('install-map', settings);
    },
    runMap(settings: Object) {
      ipcRenderer.send('run-map', settings);
    },
    installMapFromFile(settings: Object) {
      ipcRenderer.send('install-map-from-file', settings);
    },
    openFolder(path: string) {
      ipcRenderer.send('open-folder', path);
    },
    deleteInstalledMap(map: string) {
      ipcRenderer.send('delete-installed-map', map);
    },
    openInstalledMap(map: string) {
      ipcRenderer.send('open-installed-map', map);
    },
    runInstalledMap(map: string) {
      ipcRenderer.send('run-installed-map', map);
    },
    openStormMapGenerator(config: Object) {
      ipcRenderer.send('open-storm-map-generator', config);
    },
    closeStormMapGenerator(config: Object) {
      ipcRenderer.send('close-storm-map-generator', config);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'ipc-example',
        'get-settings',
        'set-settings',
        'close-window',
        'electron-ipc-error',
        'electron-ipc-success',
        'finish-install-map',
      ];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'ipc-example',
        'get-settings',
        'set-settings',
        'close-window',
        'electron-ipc-error',
        'electron-ipc-success',
        'finish-install-map',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
