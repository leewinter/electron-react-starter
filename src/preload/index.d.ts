import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendMessage: (channel: string, data: EventResponse) => void
      onMessage: (channel: string, func: (data: EventResponse) => void) => void
      removeListener: (channel: string) => void
    }
  }
}

export type EventRequest = {
  channel: string
  payload: any
  method: string
}

export type EventResponse = {
  channel: string
  payload: any
  method: string
}

export type SqlConnection = {
  connectionId: string
  connectionName: string
  connectionString: string
  queryHistory?: Array<{
    rowCountResult: number
    queryHistoryItemId: string
    sql: string
  }>
}

type SqlResult = {
  columns: any[]
  recordset: any[]
}

export enum DataChannel {
  SQL_CONNECTIONS = 'SQL_CONNECTIONS',
  SQL_LINT = 'SQL_LINT',
  SQL_EXECUTE = 'SQL_EXECUTE'
}

export enum DataChannelMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE'
}
