import { useMemo, useState } from 'react';
import { Menu, MenuItem, ListSubheader } from '@mui/material';
import { Schema, Table, Column, ForeignKey } from './sql-inspect-dialog';
import { SqlConnection } from 'src/shared/types/sql-connection';
import SqlDialogQuery from './sql-dialog-query';
import { useAiServices } from '../hooks/use-ai-services';
import ModalLoader from '../components/shared/modal-loader';
import { useDeepSeekApiKey } from '../hooks/use-deep-seek-api-key';
import { Badge } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

type MousePosition = {
  mouseX: number;
  mouseY: number;
};

type ContextMenuComponentProps = {
  mousePosition: MousePosition | null;
  onClose: () => void;
  schema: Schema | null;
  table: Table | null;
  column: Column | null;
  fk: ForeignKey | null;
  connection: SqlConnection;
};

const ContextMenuComponent: React.FC<ContextMenuComponentProps> = ({
  mousePosition,
  onClose,
  schema,
  table,
  column,
  fk,
  connection,
}) => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { getSqlJoins } = useAiServices();
  const { apiKey } = useDeepSeekApiKey();

  const breadcrumb = useMemo(() => {
    return [schema, table, column, fk]
      .filter((n) => n)
      .map((n) => n?.name)
      .join(' > ');
  }, [schema, table, column, fk]);

  const hasForeignKeys = useMemo(() => {
    if (table) return table.children.filter((c) => c.children.length > 0);
    else return [];
  }, [table]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSelectTop10 = () => {
    const columnList = table?.children.map((col) => col.name).join(', ');
    setQuery(`Select TOP 10 ${columnList} FROM ${schema?.name}.${table?.name}`);
    handleClose();
  };

  const handleGetRelationships = async () => {
    if (!apiKey) {
      setQuery('No AI API Key set in settings');
      handleClose();
      return;
    }

    const columnsWithForeignKeys = table?.children.filter((n) => n.children.length > 0);
    const foreignKeys = columnsWithForeignKeys?.flatMap((n) =>
      n.children.filter((c) => c.type === 'foreignKey'),
    );
    const columnList = table?.children.map((col) => col.name).join(', ');

    const sqlPrompt = `I need this table:-
      Select TOP 10 ${columnList} FROM ${schema?.name}.${table?.name}

      joining to these:-
      ${foreignKeys?.map((fk) => `${fk.referencedTable} ON ${fk.fullName}`).join(', ')}

      where possible can a left join be used to the main table so I get rows regardless of the relationships existing
    `;
    setLoading(true);
    const aiResult = await getSqlJoins(sqlPrompt, apiKey);

    setQuery(aiResult || null);
    handleClose();
    setLoading(false);
  };

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
        {table ? (
          <MenuItem onClick={handleSelectTop10}>
            Select TOP 10 * FROM {schema?.name}.{table.name}
          </MenuItem>
        ) : null}
        {hasForeignKeys.length ? (
          <MenuItem onClick={handleGetRelationships}>
            Select TOP 10 * FROM [RelatedTables]
            <Badge badgeContent="AI" color="primary">
              <PsychologyIcon fontSize="large" />
            </Badge>
          </MenuItem>
        ) : null}
      </Menu>
      <SqlDialogQuery
        query={query}
        connection={connection}
        open={Boolean(query)}
        onClose={() => {
          setQuery(null);
        }}
      />
      <ModalLoader open={loading} />
    </>
  );
};

export default ContextMenuComponent;
