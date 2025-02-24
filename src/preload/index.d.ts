import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      sendMessage: (channel: string, data: EventResponse) => void;
      onMessage: (channel: string, func: (data: EventResponse) => void) => void;
      removeListener: (channel: string) => void;
    };
  }
}
