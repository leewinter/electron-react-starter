import { contextBridge, ipcRenderer } from 'electron';

import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  sendMessage: (channel: string, data: any): void => {
    console.log('thing');
    ipcRenderer.send(channel, data);
  },
  onMessage: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  removeListener: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel);
  },
};

// Expose APIs only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { ...electronAPI });
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = { ...electronAPI };
  // @ts-ignore (define in dts)
  window.api = api;
}
