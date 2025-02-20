import { DataChannel } from '../shared/types/data-channel.d';

import { SqlEventsDictionary } from './lib/sql/events';

interface EventRegistration {
  channel: DataChannel;
  evenRegister: () => void;
}

const eventsArray = [
  {
    channel: DataChannel.SQL_LINT,
    evenRegister: SqlEventsDictionary[DataChannel.SQL_LINT],
  },
  {
    channel: DataChannel.SQL_EXECUTE,
    evenRegister: SqlEventsDictionary[DataChannel.SQL_EXECUTE],
  },
] as EventRegistration[];

eventsArray.forEach((e: EventRegistration) => e.evenRegister());
