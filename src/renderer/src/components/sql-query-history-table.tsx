import React, { useMemo, useState } from 'react';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SqlConnection, QueryHistory } from '../../../shared/types/sql-connection';
import SqlDialogQuery from './sql-dialog-query';

interface QueryHistoryProps {
  connection: SqlConnection;
  queryHistoryFilter?: (query: QueryHistory) => boolean;
}

const QueryHistoryTable: React.FC<QueryHistoryProps> = ({ connection, queryHistoryFilter }) => {
  const { connectionName } = connection;
  const [query, setQuery] = useState<string | null>(null);
  const [queryLimit, setQueryLimit] = useState<number>(5);

  const theme = useTheme();

  const filteredQueryHistory = useMemo(() => {
    if (!connection || !connection.queryHistory) return [];
    return queryHistoryFilter
      ? connection.queryHistory.filter(queryHistoryFilter)
      : connection.queryHistory;
  }, [connection, queryHistoryFilter]);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  // Determine the queries to show based on the selected limit
  const displayedQueries =
    queryLimit === -1 ? filteredQueryHistory : filteredQueryHistory.slice(-queryLimit);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Query History for {connectionName}
        </Typography>

        {filteredQueryHistory.length > 0 ? (
          <>
            {/* Dropdown to control how many history items are shown */}
            <FormControl sx={{ minWidth: 120, marginBottom: 2 }}>
              <InputLabel id="query-limit-label">Show</InputLabel>
              <Select
                labelId="query-limit-label"
                label="Show"
                value={queryLimit}
                onChange={(e) => setQueryLimit(Number(e.target.value))}
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
                    {!isSmallScreen && (
                      <TableCell>
                        <strong>Query ID</strong>
                      </TableCell>
                    )}
                    <TableCell>
                      <strong>SQL Query</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Row Count</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedQueries
                    .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))
                    .map((query) => (
                      <TableRow
                        key={query.queryHistoryItemId}
                        onClick={() => setQuery(query.sql)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        {!isSmallScreen && <TableCell>{query.queryHistoryItemId}</TableCell>}
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

      <SqlDialogQuery
        query={query}
        connection={connection}
        open={Boolean(query)}
        onClose={() => {
          setQuery(null);
        }}
      />
    </Card>
  );
};

export default QueryHistoryTable;
