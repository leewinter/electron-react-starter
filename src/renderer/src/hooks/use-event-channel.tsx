import { type EventRequest, type EventResponse } from '../../../preload/index.d'

export const useEventChannel = ({ channel }: { channel: string }) => {
  return {
    sendMessage: function (msg: EventRequest) {
      if (channel) {
        // Send message to Electron
        window.api.sendMessage(`${channel}-request`, msg)
      }
    },
    onMessage: function (response: (data: EventResponse) => void) {
      if (channel && response) {
        // Listen for response from Electron
        window.api.onMessage(`${channel}-response`, (data) => {
          if (response) response(data)
        })
      }
    },
    removeListener: function () {
      if (channel) {
        // Remove listener
        window.api.removeListener(`${channel}-response`)
      }
    }
  }
}
