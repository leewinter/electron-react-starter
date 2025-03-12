// Represents a single Foreign Key reference
export interface ForeignKey {
  id: string;
  name: string; // e.g., "SurveyId → Surveys.SurveyId"
  fullName: string;
  referencedTable: string;
  type: 'foreignKey';
  foreignTable?: Table;
}

// Represents a single column, which may contain foreign keys as children
export interface Column {
  id: string;
  name: string; // e.g., "SurveyId (int)"
  fullName: string;
  dataType: string;
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

export function mapSqlSchemaToTreeData(tables: any[]): SqlSchemaTree {
  const schemaMap: Record<string, Schema> = {};
  const tableMap: Record<string, Table> = {}; // Store references to tables
  const pendingForeignKeys: { fk: ForeignKey; referencedTableKey: string }[] = [];

  // **First Pass: Create all schemas and tables**
  tables.forEach((table) => {
    const { SchemaName, TableName } = table;

    // Ensure the schema exists
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

    // Store the table reference in the tableMap
    const tableKey = `${SchemaName}.${TableName}`;
    tableMap[tableKey] = tableNode;

    // Add the table node to the schema
    schemaMap[SchemaName].children.push(tableNode);
  });

  // **Second Pass: Add columns and foreign keys**
  tables.forEach((table) => {
    const { SchemaName, TableName, columns, foreignKeys } = table;
    const tableNode = tableMap[`${SchemaName}.${TableName}`];

    tableNode.children = columns.map((col): Column => {
      const colNode: Column = {
        id: `col-${SchemaName}-${TableName}-${col.ColumnName}`,
        name: col.ColumnName,
        dataType: col.DataType,
        fullName: `${col.ColumnName} (${col.DataType})`,
        type: 'column',
        children: [],
      };

      // Find foreign keys related to this column
      const relatedForeignKeys: ForeignKey[] = (foreignKeys || [])
        .filter((fk) => fk.ColumnName === col.ColumnName)
        .map((fk) => {
          const referencedTableKey = `${fk.ReferencedSchemaName}.${fk.ReferencedTableName}`;

          const foreignKey: ForeignKey = {
            id: `fk-${SchemaName}-${TableName}-${fk.ForeignKeyName}`,
            name: `${fk.ReferencedTableName}.${fk.ReferencedColumnName}`,
            fullName: `${fk.ColumnName} → ${fk.ReferencedSchemaName}.${fk.ReferencedTableName}.${fk.ReferencedColumnName}`,
            referencedTable: referencedTableKey,
            type: 'foreignKey',
            foreignTable: tableMap[referencedTableKey] || null, // Try to find the referenced table
          };

          if (!foreignKey.foreignTable) {
            pendingForeignKeys.push({ fk: foreignKey, referencedTableKey });
          }

          return foreignKey;
        });

      colNode.children = relatedForeignKeys;
      return colNode;
    });
  });

  // **Final Pass: Resolve pending foreign keys**
  pendingForeignKeys.forEach(({ fk, referencedTableKey }) => {
    fk.foreignTable = tableMap[referencedTableKey] || null;
  });

  return Object.values(schemaMap);
}
