import { SqlConnection } from '../../../shared/types/sql-connection';
import localforage from 'localforage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type SqlConnectionsHookResponse = {
  connections: SqlConnection[];
  setConnections: (connections: SqlConnection[]) => void;
};

const SQL_CONNECTION_KEY = 'SQL_CONNECTIONS'

export const useSqlConnections = (): SqlConnectionsHookResponse => {
  const queryClient = useQueryClient();

  const { data: connections } = useQuery({
    queryKey: [SQL_CONNECTION_KEY],
    queryFn: async () => {
      try {
        const value = await localforage.getItem('sql-connections');
        return value as SqlConnection[];
      } catch (err) {
        console.log(err);
        return undefined;
      }
    },
  });

  const { mutate: setConnections } = useMutation({
    mutationFn: async function (connections: SqlConnection[]): Promise<SqlConnection[]> {
      try {
        const value = await localforage.setItem('sql-connections', connections);
        return value;
      } catch (err) {
        console.log(err);
        return connections;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [SQL_CONNECTION_KEY] });
    },
  });

  return {
    connections: connections ?? [],
    setConnections,
  };
};
