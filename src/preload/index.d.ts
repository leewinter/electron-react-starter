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

///
// Event Payloads
export enum DataChannel {
  SQL_CONNECTIONS = 'SQL_CONNECTIONS',
  SQL_LINT = 'SQL_LINT',
  SQL_EXECUTE = 'SQL_EXECUTE',
}

export enum DataChannelMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

export type EventRequest<T> = {
  channel: string;
  payload: T;
  method: string;
};

export type EventResponse<T> = {
  channel: string;
  payload: T;
  method?: string;
};

// Lint
export type SqlLintPayload = {
  sql: string;
};

SqlColumnType = { name: string };

// Execute
export type SqlColumn = {
  name: string;
  type: string | SqlColumnType;
  length: number;
  nullable: boolean;
  precision: number;
  scale: number;
};

export type SqlExecutionResponsePayload = {
  recordset: Array<Array<unknow>>;
  columns: SqlColumn[];
};

export type SqlExecutionRequestPayload = {
  sql: string;
  selectedConnection: SqlConnection;
};

///
// General Types
export type SqlConnection = {
  connectionId: string;
  connectionName: string;
  connectionString: string;
  queryHistory?: Array<{
    rowCountResult: number;
    queryHistoryItemId: string;
    sql: string;
    date: Date;
  }>;
};
