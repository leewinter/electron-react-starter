import { Container } from '@mui/material';

import SqlQueryComponent from '../components/query/sql-query-component';

export default function SqlPage(): JSX.Element {
  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      <SqlQueryComponent />
    </Container>
  );
}
