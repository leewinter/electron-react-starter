export type EventRequest = {
  channel: string,
  payload: any,
  method: string
}

export type EventResponse = {
  channel: string,
  payload: any,
  method: string
}

export type SqlConnection = {
  connectionId: string,
  connectionName: string,
  connectionString: string
}