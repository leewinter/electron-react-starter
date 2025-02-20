import { type EventRequest, type EventResponse } from '../../../preload/index.d';

type EventChannelHookResponse = {
  sendMessage: (msg: EventRequest<any>) => void;
  onMessage: (response: (data: EventResponse<any>) => void) => void;
  removeListener: () => void;
};

export const useEventChannel = ({ channel }: { channel: string }): EventChannelHookResponse => {
  return {
    sendMessage: function (msg: EventRequest<any>): void {
      if (channel) {
        // Send message to Electron
        window.api.sendMessage(`${channel}-request`, msg);
      }
    },
    onMessage: function (response: (data: EventResponse<any>) => void): void {
      if (channel && response) {
        // Listen for response from Electron
        window.api.onMessage(`${channel}-response`, (data: EventResponse<any>) => {
          if (response) response(data);
        });
      }
    },
    removeListener: function (): void {
      if (channel) {
        // Remove listener
        window.api.removeListener(`${channel}-response`);
      }
    },
  };
};
