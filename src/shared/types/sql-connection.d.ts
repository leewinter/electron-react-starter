// General Types
export type SqlConnection = {
  connectionId: string;
  connectionName: string;
  connectionString: string;
  queryHistory?: Array<{
    rowCountResult: number;
    queryHistoryItemId: string;
    sql: string;
    date?: Date;
  }>;
  tables?: Array<any>;
  lastInspectDate?: Date;
};
