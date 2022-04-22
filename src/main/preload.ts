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
    openFolder(path: string) {
      ipcRenderer.send('open-folder', path);
    },
    deleteInstalledMap(map: string) {
      ipcRenderer.send('delete-installed-map', map);
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
