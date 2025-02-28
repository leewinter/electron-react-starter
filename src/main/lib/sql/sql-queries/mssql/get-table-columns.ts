export default `SELECT
  s.name AS SchemaName,
  t.name AS TableName,
  c.name AS ColumnName,
  c.column_id AS ColumnPosition,
  ty.name AS DataType,
  c.max_length AS MaxLength,
  c.is_nullable AS IsNullable,
  c.default_object_id AS DefaultConstraintId
FROM
  sys.columns c
  JOIN sys.tables t ON c.object_id = t.object_id
  JOIN sys.schemas s ON t.schema_id = s.schema_id
  JOIN sys.types ty ON c.user_type_id = ty.user_type_id
ORDER BY
  SchemaName,
  TableName,
  ColumnPosition;`;
