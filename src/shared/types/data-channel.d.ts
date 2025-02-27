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

// Execute
export type SqlColumn = {
  name: string;
  type: string;
  length: number;
  nullable: boolean;
  precision: number;
  scale: number;
};

export type SqlExecutionResponsePayload = {
  recordset: Array<Array<any>>;
  columns: SqlColumn[];
};

export type SqlExecutionRequestPayload = {
  sql: string;
  selectedConnection: SqlConnection;
};
