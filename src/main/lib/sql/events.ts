import {
  DataChannel,
  EventRequest,
  EventResponse,
  SqlLintPayload,
  SqlExecutionResponsePayload,
  SqlExecutionRequestPayload,
  SqlColumn,
} from '../../../shared/types/data-channel.d';
import { IpcMainEvent, ipcMain } from 'electron';
import { format } from 'sql-formatter';
import { parseSqlConnectionString } from './index';
import * as mssql from 'mssql';

type MssqlTediousColumn = {
  index: number;
  name: string;
  length: number;
  type: () => { name: string };
  scale: number | undefined;
  precision: number | undefined;
  nullable: boolean;
  caseSensitive: boolean;
  identity: boolean;
  readOnly: boolean;
};

export const SqlEventsDictionary = {
  [DataChannel.SQL_LINT]: function (): void {
    ipcMain.on(
      `${DataChannel.SQL_LINT}-request`,
      async (event: IpcMainEvent, args: EventRequest<SqlLintPayload>) => {
        console.log('Received from React:', args);

        const formattedCode = format(args.payload.sql, { language: 'tsql' });
        console.log('formattedCode', formattedCode);
        // Would be generated by some work
        const generatedResponsePayload = {
          channel: DataChannel.SQL_LINT,
          payload: { sql: formattedCode },
        } as EventResponse<SqlLintPayload>;

        // Send a response back to the renderer process
        event.reply(`${DataChannel.SQL_LINT}-response`, generatedResponsePayload);
      },
    );
  },
  [DataChannel.SQL_EXECUTE]: function (): void {
    ipcMain.on(
      `${DataChannel.SQL_EXECUTE}-request`,
      async (event: IpcMainEvent, args: EventRequest<SqlExecutionRequestPayload>) => {
        console.log('Received from React:', args);
        try {
          const sqlConfig = parseSqlConnectionString(
            args.payload.selectedConnection.connectionString,
          );

          await mssql.connect(sqlConfig);
          const request = new mssql.Request();
          request.arrayRowMode = true;

          const result = await request.query(args.payload.sql);

          const sqlResult = result as unknown as SqlExecutionResponsePayload;

          const recordset = result.recordset ?? [];

          const columns: SqlColumn[] =
            Array.isArray(sqlResult?.columns) && Array.isArray(sqlResult.columns[0])
              ? sqlResult.columns[0].map((col: MssqlTediousColumn) => {
                  return {
                    name: col.name,
                    type: col.type.name,
                    length: col.length,
                    nullable: col.nullable,
                    precision: col.precision,
                    scale: col.scale,
                  } as SqlColumn;
                })
              : [];

          const generatedResponsePayload = {
            channel: DataChannel.SQL_EXECUTE,
            payload: { recordset, columns },
          } as EventResponse<SqlExecutionResponsePayload>;

          event.reply(`${DataChannel.SQL_EXECUTE}-response`, generatedResponsePayload);
        } catch (error) {
          console.error(error);
        }
      },
    );
  },
};
