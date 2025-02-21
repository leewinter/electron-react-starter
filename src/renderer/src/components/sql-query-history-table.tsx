import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { SqlConnection } from '../../../preload/index.d';

interface QueryHistoryProps {
  connection: SqlConnection;
}

const QueryHistoryTable: React.FC<QueryHistoryProps> = ({ connection }) => {
  const { connectionName, queryHistory } = connection;

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Query History for {connectionName}
        </Typography>

        {queryHistory && queryHistory.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Query ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>SQL Query</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Row Count</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryHistory.map(query => (
                  <TableRow key={query.queryHistoryItemId}>
                    <TableCell>{query.queryHistoryItemId}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '300px', // Prevents overly long queries from breaking UI
                        }}
                        title={query.sql} // Show full SQL on hover
                      >
                        {query.sql}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{query.rowCountResult}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No query history available.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryHistoryTable;
