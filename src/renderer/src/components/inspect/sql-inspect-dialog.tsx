import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import ContextMenuComponent from './sql-inspect-dialog-context-menu';
import DnsIcon from '@mui/icons-material/Dns'; // Column Icon
import LinkIcon from '@mui/icons-material/Link'; // Foreign Key Icon
import SchemaIcon from '@mui/icons-material/Schema';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SqlConnection } from 'src/shared/types/sql-connection';
import SqlConnectionInspect from '../connection/sql-connection-inspect';
import StorageIcon from '@mui/icons-material/Storage'; // Database Icon
import TableChartIcon from '@mui/icons-material/TableChart';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTheme } from '@mui/material/styles';
import { Schema, Table, Column, ForeignKey, mapSqlSchemaToTreeData } from './utils/map-sql-schema-to-tree-data';

type SqlInspectInputProps = {
  connection: SqlConnection | null;
  open: boolean;
  onClose: () => void;
  updateConnection: (connection: SqlConnection) => void;
};

type MousePosition = {
  mouseX: number;
  mouseY: number;
};

const SqlInspectDialog: React.FC<SqlInspectInputProps> = ({
  connection,
  open,
  onClose,
  updateConnection,
}) => {
  const [menuPosition, setMenuPosition] = useState<MousePosition | null>(null);
  const [schema, setSchema] = useState<Schema | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [column, setColumn] = useState<Column | null>(null);
  const [fk, setFk] = useState<ForeignKey | null>(null);
  const theme = useTheme();

  const schemas = useMemo(() => {
    return connection?.tables?.length ? mapSqlSchemaToTreeData(connection.tables) : [];
  }, [connection]);

  const getMenuPosition = (event: React.MouseEvent<HTMLLIElement>) => {
    return menuPosition === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null;
  };

  const handleSchemaContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    schema: Schema,
  ) => {
    setMenuPosition(getMenuPosition(event));
    setSchema(schema);
  };

  const handleTableContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    schema: Schema,
    table: Table,
  ) => {
    setMenuPosition(getMenuPosition(event));
    setSchema(schema);
    setTable(table);
  };

  const handleColumnContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    schema: Schema,
    table: Table,
    column: Column,
  ) => {
    setMenuPosition(getMenuPosition(event));
    setSchema(schema);
    setTable(table);
    setColumn(column);
  };

  const handleFkContextMenu = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    schema: Schema,
    table: Table,
    column: Column,
    fk: ForeignKey,
  ) => {
    setMenuPosition(getMenuPosition(event));
    setSchema(schema);
    setTable(table);
    setColumn(column);
    setFk(fk);
  };

  const handleContextMenuClose = () => {
    setMenuPosition(null);
    setSchema(null);
    setTable(null);
    setColumn(null);
    setFk(null);
  };

  if (!connection) return null;

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>Connection Schema</DialogTitle>
        <DialogContent dividers>
          {connection ? (
            <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <StorageIcon /> SQL Schema Explorer
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1" gutterBottom>
                  Last updated - {connection.lastInspectDate?.toLocaleString()}
                </Typography>
                <SqlConnectionInspect
                  connection={connection}
                  onLoaded={(payload) => {
                    updateConnection(payload.connection);
                  }}
                />
              </Box>

              <SimpleTreeView>
                {schemas.map((schema) => (
                  <TreeItem
                    onContextMenu={(event) => handleSchemaContextMenu(event, schema)}
                    key={schema.id}
                    itemId={schema.id}
                    sx={{ color: theme.palette.secondary.main }}
                    label={
                      <Box display="flex" alignItems="center">
                        <SchemaIcon fontSize="small" sx={{ mr: 1 }} />
                        {schema.name}
                      </Box>
                    }
                  >
                    {schema.children.map((table) => (
                      <TreeItem
                        onContextMenu={(event) => handleTableContextMenu(event, schema, table)}
                        key={table.id}
                        itemId={table.id}
                        sx={{ color: theme.palette.primary.main }}
                        label={
                          <Box display="flex" alignItems="center">
                            <TableChartIcon fontSize="small" sx={{ mr: 1 }} />
                            {table.name}
                          </Box>
                        }
                      >
                        {table.children.map((column) => (
                          <TreeItem
                            onContextMenu={(event) =>
                              handleColumnContextMenu(event, schema, table, column)
                            }
                            key={column.id}
                            itemId={column.id}
                            sx={{ color: theme.palette.text.primary }}
                            label={
                              <Box display="flex" alignItems="center">
                                <DnsIcon fontSize="small" sx={{ mr: 1 }} />
                                {column.name}
                                <Box
                                  display="flex"
                                  sx={{ ml: 1, color: theme.palette.secondary.dark }}
                                >
                                  ({column.dataType})
                                </Box>
                              </Box>
                            }
                          >
                            {/* Foreign Keys inside the column */}
                            {column.children.map((fk) => (
                              <TreeItem
                                onContextMenu={(event) =>
                                  handleFkContextMenu(event, schema, table, column, fk)
                                }
                                key={fk.id}
                                itemId={fk.id}
                                sx={{ color: theme.palette.info.main }}
                                label={
                                  <Box display="flex" alignItems="center">
                                    <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                                    {fk.name}
                                  </Box>
                                }
                              />
                            ))}
                          </TreeItem>
                        ))}
                      </TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </SimpleTreeView>
            </Box>
          ) : (
            <Typography>No schema available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ContextMenuComponent
        mousePosition={menuPosition}
        onClose={handleContextMenuClose}
        schema={schema}
        table={table}
        column={column}
        fk={fk}
        connection={connection}
      />
    </div>
  );
};

export default SqlInspectDialog;
