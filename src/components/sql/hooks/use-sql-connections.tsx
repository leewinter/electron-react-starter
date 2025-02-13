import { SqlConnection } from 'src/types/events';
import localforage from 'localforage';

export const useSqlConnections = () => {
  return {
    getItem: async function () {
      try {
        const value = await localforage.getItem('sql-connections');
        return value as SqlConnection[];
      } catch (err) {
        console.log(err);
      }
    },
    setItem: async function (connections: SqlConnection[]) {
      try {
        const value = await localforage.setItem('sql-connections', connections);
        return value;
      } catch (err) {
        console.log(err);
      }
    },
  };
};
