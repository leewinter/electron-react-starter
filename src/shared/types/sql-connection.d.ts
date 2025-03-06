// General Types
export type QueryHistory = {
  rowCountResult: number;
  queryHistoryItemId: string;
  sql: string;
  date?: Date;
};

export type SqlConnection = {
  connectionId: string;
  connectionName: string;
  connectionString: string;
  queryHistory?: Array<QueryHistory>;
  tables?: Array<any>;
  lastInspectDate?: Date;
};
