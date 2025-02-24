import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { SqlConnection } from '../../../shared/types/sql-connection';

interface QueryHistoryProps {
  connection: SqlConnection;
}

const QueryHistoryTable: React.FC<QueryHistoryProps> = ({ connection }) => {
  const { connectionName, queryHistory = [] } = connection;

  const [queryLimit, setQueryLimit] = useState<number>(5);

  // Determine the queries to show based on the selected limit
  const displayedQueries = queryLimit === -1 ? queryHistory : queryHistory.slice(-queryLimit);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Query History for {connectionName}
        </Typography>

        {queryHistory.length > 0 ? (
          <>
            {/* Dropdown to control how many history items are shown */}
            <FormControl sx={{ minWidth: 120, marginBottom: 2 }}>
              <InputLabel id="query-limit-label">Show</InputLabel>
              <Select
                labelId="query-limit-label"
                value={queryLimit}
                onChange={e => setQueryLimit(Number(e.target.value))}
              >
                <MenuItem value={5}>Last 5</MenuItem>
                <MenuItem value={10}>Last 10</MenuItem>
                <MenuItem value={20}>Last 20</MenuItem>
                <MenuItem value={-1}>All</MenuItem>
              </Select>
            </FormControl>

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
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedQueries.map(query => (
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
                      <TableCell align="right">{query.date?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
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
