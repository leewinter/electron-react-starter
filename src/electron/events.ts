import { ipcMain, IpcMainEvent } from 'electron';
import {type EventRequest, type EventResponse} from '../types/events';
import {DataChannel, DataChannelMethod} from './data-channels';
import { SqlConnection } from '../types/events';

let inMemoryConnections: SqlConnection[] = []

const eventsArray = [
  {
    channel: DataChannel.SQL_CONNECTIONS,
    evenRegister: function () {
      ipcMain.on(`${this.channel}-request`, async (event: IpcMainEvent, args: EventRequest) => {
        console.log("Received from React:", args);

        if(!inMemoryConnections) inMemoryConnections = [];

        if(args.method) {
          if(args.method === DataChannelMethod.POST) {
            const updatedConnections = inMemoryConnections.map(n=>n.connectionId === args.payload.connectionId ? args.payload : n);
            if(!updatedConnections.some(n=>n.connectionId === args.payload.connectionId)) updatedConnections.push(args.payload)
            inMemoryConnections = updatedConnections
          }

          if(args.method === DataChannelMethod.DELETE) {
            const updatedConnections = inMemoryConnections.filter(n=>n.connectionId !== args.payload.connectionId);
            inMemoryConnections = updatedConnections
          }

          // Would be generated by some work
          const generatedResponsePayload = { channel: this.channel, payload: {  connections: inMemoryConnections } } as EventResponse;

          // Send a response back to the renderer process
          event.reply(`${this.channel}-response`, generatedResponsePayload);
        }
      });
    }
  }
];

eventsArray.forEach(e=>e.evenRegister())