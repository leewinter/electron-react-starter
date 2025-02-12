import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import React from 'react';
import { SqlConnection } from 'src/types/events';

const getDefaultConnection = () =>
  ({
    connectionId: crypto.randomUUID(),
    connectionName: '',
    connectionString: '',
    queryHistory: [],
  }) as SqlConnection;

type SqlConnectionTableProps = {
  data: SqlConnection[];
  onEdit: (connection: SqlConnection) => void;
  onDelete: (connectionId: SqlConnection) => void;
  onAdd: (connection: SqlConnection) => void;
  onHistory: (connection: SqlConnection) => void;
};

const SqlConnectionTable: React.FC<SqlConnectionTableProps> = ({
  data,
  onEdit,
  onDelete,
  onAdd,
  onHistory,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Connection Name</b>
            </TableCell>
            <TableCell>
              <b>Connection String</b>
            </TableCell>
            <TableCell align="right">
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(connection => (
            <TableRow key={connection.connectionId}>
              <TableCell>{connection.connectionName}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {connection.connectionString}
              </TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(connection)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(connection)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => onHistory(connection)}>
                  <HistoryIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* Footer with Right-Aligned Add New Button */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <Box display="flex" justifyContent="flex-end" mt={2} mb={2} pr={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => onAdd(getDefaultConnection())}
                >
                  Add New
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default SqlConnectionTable;
