import { useEffect, useState } from "react";
import { useEventChannel } from '../hooks/use-event-channel'
import { type EventRequest, type EventResponse } from '../types/events'

declare global {
  interface Window {
    electron: {
      sendMessage: (channel: string, data: EventResponse) => void;
      onMessage: (channel: string, func: (data: EventResponse) => void) => void;
    };
  }
}

const CHANNEL = 'hello';

function App() {
  const [message, setMessage] = useState("");
  const { sendMessage, onMessage } = useEventChannel({ channel: CHANNEL })

  useEffect(() => {
    // Send message to Electron
    onMessage((data: EventResponse) => {
      setMessage(data.payload.message);
    });

  }, []);

  return (
    <div>
      <h1>React & Electron IPC</h1>
      <p>Message from Electron: {message}</p>
      <button onClick={() => {
        sendMessage({ channel: CHANNEL, payload: { message: "Hello Electron" } } as EventRequest);
      }}>Send Message</button>
    </div>
  );
}

export default App;