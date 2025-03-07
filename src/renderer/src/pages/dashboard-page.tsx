import Typography from '@mui/material/Typography';
import { Container, Grid2 } from '@mui/material';
import { useSqlConnections } from '../hooks/use-sql-connections';
import QueryHistoryTable from '../components/sql-query-history-table';

export default function DashboardPage(): JSX.Element {
  const { connections } = useSqlConnections();
  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      <Typography variant="h5">Welcome to MSSQL Inspect</Typography>
      <Grid2 container={true} spacing={2} sx={{ mt: 2 }}>
        {connections.map((conn) => {
          return (
            <Grid2 size={{ xs: 12, md: 12, lg: 12 }} key={conn.connectionId}>
              <QueryHistoryTable connection={conn} />
            </Grid2>
          );
        })}
      </Grid2>
    </Container>
  );
}
