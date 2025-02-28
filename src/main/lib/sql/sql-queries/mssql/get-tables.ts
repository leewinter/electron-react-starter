export default `SELECT
  s.name AS SchemaName,
  t.name AS TableName
FROM
  sys.tables t
  JOIN sys.schemas s ON t.schema_id = s.schema_id
ORDER BY
  s.name,
  t.name;`;
