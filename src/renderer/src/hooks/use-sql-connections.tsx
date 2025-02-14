import { SqlConnection } from '../../../preload/index.d'
import localforage from 'localforage'

export const useSqlConnections = (): {
  getItem: () => Promise<SqlConnection[] | undefined>
  setItem: (connections: SqlConnection[]) => Promise<SqlConnection[]>
} => {
  return {
    getItem: async function (): Promise<SqlConnection[] | undefined> {
      try {
        const value = await localforage.getItem('sql-connections')
        return value as SqlConnection[]
      } catch (err) {
        console.log(err)
        return undefined
      }
    },
    setItem: async function (connections: SqlConnection[]): Promise<SqlConnection[]> {
      try {
        const value = await localforage.setItem('sql-connections', connections)
        return value
      } catch (err) {
        console.log(err)
        return connections
      }
    }
  }
}
