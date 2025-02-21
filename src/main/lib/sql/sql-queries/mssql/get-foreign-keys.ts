export default `SELECT
  fk.name AS ForeignKeyName,
  OBJECT_SCHEMA_NAME(fkc.parent_object_id) AS SchemaName,
  OBJECT_NAME(fkc.parent_object_id) AS TableName,
  COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
  OBJECT_SCHEMA_NAME(fkc.referenced_object_id) AS ReferencedSchemaName,
  OBJECT_NAME(fkc.referenced_object_id) AS ReferencedTableName,
  COL_NAME(
    fkc.referenced_object_id,
    fkc.referenced_column_id
  ) AS ReferencedColumnName
FROM
  sys.foreign_keys fk
  JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
ORDER BY
  SchemaName,
  TableName;`;
