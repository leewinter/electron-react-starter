export type EventRequest = {
  channel: string;
  payload: any;
  method: string;
};

export type EventResponse = {
  channel: string;
  payload: any;
  method: string;
};

export type QueryHistory = {
  queryHistoryItemId: string;
  sql: string;
  rowCountResult: number;
};

export type SqlConnection = {
  connectionId: string;
  connectionName: string;
  connectionString: string;
  queryHistory: QueryHistory[];
};
