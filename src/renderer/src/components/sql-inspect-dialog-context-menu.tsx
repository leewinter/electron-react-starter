import { useMemo, useState } from "react";
import { Menu, MenuItem, ListSubheader } from "@mui/material";
import { Schema, Table, Column, ForeignKey } from './sql-inspect-dialog'
import { SqlConnection } from 'src/shared/types/sql-connection';
import SqlDialogQuery from './sql-dialog-query';

type MousePosition = {
  mouseX: number;
  mouseY: number;
}

type ContextMenuComponentProps = {
  mousePosition: MousePosition | null;
  onClose: () => void;
  schema: Schema | null;
  table: Table | null;
  column: Column | null;
  fk: ForeignKey | null;
  connection: SqlConnection;
};

const ContextMenuComponent: React.FC<ContextMenuComponentProps> = ({ mousePosition, onClose, schema, table, column, fk, connection }) => {
  const [query, setQuery] = useState<string | null>(null);

  const breadcrumb = useMemo(() => {
    return [schema, table, column, fk].filter(n => n).map(n => n?.name).join(" > ")
  }, [
    schema, table, column, fk
  ])

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSelectTop10 = () => {
    const columnList = table?.children.map(col => col.name).join(", ");
    setQuery(`Select TOP 10 ${columnList} FROM ${schema?.name}.${table?.name}`);
    handleClose();
  }

  return (
    <>
      <Menu
        open={mousePosition !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mousePosition !== null
            ? { top: mousePosition.mouseY, left: mousePosition.mouseX }
            : undefined
        }
      >
        <ListSubheader>{breadcrumb}</ListSubheader>
        {table ? <MenuItem onClick={handleSelectTop10}>Select TOP 10 * FROM {schema?.name}.{table.name}</MenuItem> : null}
      </Menu>
      <SqlDialogQuery
        query={query}
        connection={connection}
        open={Boolean(query)}
        onClose={() => {
          setQuery(null);
        }}
      />
    </>
  );
}

export default ContextMenuComponent;
