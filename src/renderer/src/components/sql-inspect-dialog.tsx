import React, { useMemo } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import SchemaIcon from '@mui/icons-material/Schema';
import TableChartIcon from '@mui/icons-material/TableChart';
import DnsIcon from '@mui/icons-material/Dns'; // Column Icon
import LinkIcon from '@mui/icons-material/Link'; // Foreign Key Icon
import StorageIcon from '@mui/icons-material/Storage'; // Database Icon
import { SqlConnection } from 'src/shared/types/sql-connection';
import SqlConnectionInspect from './sql-connection-inspect';

// Represents a single Foreign Key reference
export interface ForeignKey {
  id: string;
  name: string; // e.g., "SurveyId → Surveys.SurveyId"
  type: 'foreignKey';
}

// Represents a single column, which may contain foreign keys as children
export interface Column {
  id: string;
  name: string; // e.g., "SurveyId (int)"
  type: 'column';
  children: ForeignKey[]; // Foreign keys mapped under their respective column
}

// Represents a Table containing Columns
export interface Table {
  id: string;
  name: string; // Table Name
  type: 'table';
  children: Column[]; // Columns are the children of the table
}

// Represents a Schema containing Tables
export interface Schema {
  id: string;
  name: string; // Schema Name
  type: 'schema';
  children: Table[]; // Tables are the children of the schema
}

// Root Type - Array of Schemas
export type SqlSchemaTree = Schema[];

function mapSqlSchemaToTreeData(tables: any[]): SqlSchemaTree {
  const schemaMap: Record<string, Schema> = {};

  tables.forEach((table) => {
    const { SchemaName, TableName, columns, foreignKeys } = table;

    // If the schema doesn't exist, create it
    if (!schemaMap[SchemaName]) {
      schemaMap[SchemaName] = {
        id: `schema-${SchemaName}`,
        name: SchemaName,
        type: 'schema',
        children: [],
      };
    }

    // Create the table node
    const tableNode: Table = {
      id: `table-${SchemaName}-${TableName}`,
      name: TableName,
      type: 'table',
      children: [],
    };

    // Add columns and nest foreign keys under their respective columns
    tableNode.children = columns.map((col): Column => {
      const colNode: Column = {
        id: `col-${SchemaName}-${TableName}-${col.ColumnName}`,
        name: `${col.ColumnName} (${col.DataType})`,
        type: 'column',
        children: [],
      };

      // Find foreign keys related to this column
      const relatedForeignKeys: ForeignKey[] = (foreignKeys || [])
        .filter((fk) => fk.ColumnName === col.ColumnName)
        .map((fk) => ({
          id: `fk-${SchemaName}-${TableName}-${fk.ForeignKeyName}`,
          name: `${fk.ColumnName} → ${fk.ReferencedTableName}.${fk.ReferencedColumnName}`,
          type: 'foreignKey',
        }));

      colNode.children = relatedForeignKeys;
      return colNode;
    });

    // Add the table node to the schema
    schemaMap[SchemaName].children.push(tableNode);
  });

  return Object.values(schemaMap);
}

type SqlInspectInputProps = {
  connection: SqlConnection | null;
  open: boolean;
  onClose: () => void;
  updateConnection: (connection: SqlConnection) => void;
};

const SqlInspectDialog: React.FC<SqlInspectInputProps> = ({
  connection,
  open,
  onClose,
  updateConnection,
}) => {
  const schemas = useMemo(() => {
    return connection?.tables?.length ? mapSqlSchemaToTreeData(connection.tables) : [];
  }, [connection]);

  if (!connection) return null;

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>Connection Schema</DialogTitle>
        <DialogContent dividers>
          {connection ? (
            <Box sx={{ maxWidth: 400, bgcolor: 'background.paper', p: 2 }}>
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
                    key={schema.id}
                    itemId={schema.id}
                    label={
                      <Box display="flex" alignItems="center">
                        <SchemaIcon fontSize="small" sx={{ mr: 1 }} />
                        {schema.name}
                      </Box>
                    }
                  >
                    {schema.children.map((table) => (
                      <TreeItem
                        key={table.id}
                        itemId={table.id}
                        label={
                          <Box display="flex" alignItems="center">
                            <TableChartIcon fontSize="small" sx={{ mr: 1 }} />
                            {table.name}
                          </Box>
                        }
                      >
                        {table.children.map((column) => (
                          <TreeItem
                            key={column.id}
                            itemId={column.id}
                            label={
                              <Box display="flex" alignItems="center">
                                <DnsIcon fontSize="small" sx={{ mr: 1 }} />
                                {column.name}
                              </Box>
                            }
                          >
                            {/* Foreign Keys inside the column */}
                            {column.children.map((fk) => (
                              <TreeItem
                                key={fk.id}
                                itemId={fk.id}
                                label={
                                  <Box display="flex" alignItems="center">
                                    <LinkIcon fontSize="small" sx={{ mr: 1, color: 'blue' }} />
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
    </div>
  );
};

export default SqlInspectDialog;
