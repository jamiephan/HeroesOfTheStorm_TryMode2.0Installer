declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        getSettings(): void;
        setSettings(settings: Object): void;
        openHeroesInstallDialog(): void;
        closeWindow(): void;
        installMap(settings: Object): void;
        runMap(settings: Object): void;
        openFolder(path: string): void;
        deleteInstalledMap(map: string): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
