import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import { useSqlConnections } from '../hooks/use-sql-connections';
import QueryHistoryTable from '../components/sql-query-history-table';

export default function DashboardPage(): JSX.Element {
  const { connections } = useSqlConnections();
  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      <Typography>Welcome to MSSQL Inspect</Typography>
      {connections.map(conn => {
        return <QueryHistoryTable key={conn.connectionId} connection={conn} />;
      })}
    </Container>
  );
}
