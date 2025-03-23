import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import PropTypes from 'prop-types';
import { SqlConnection } from '../../../../shared/types/sql-connection';
import { useSqlConnections } from '../../hooks/use-sql-connections';

type SqlConnectionSelectProps = {
  selectedConnection: SqlConnection | null;
  onChange: (connectionId: string) => void;
};

const SQL_CONNECTION_SELECT_LABEL = 'Select SQL Connection';

const SqlConnectionSelect: React.FC<SqlConnectionSelectProps> = ({
  selectedConnection,
  onChange,
}) => {
  const { connections } = useSqlConnections();

  return (
    <FormControl fullWidth>
      <InputLabel>{SQL_CONNECTION_SELECT_LABEL}</InputLabel>
      <Select
        label={SQL_CONNECTION_SELECT_LABEL}
        value={selectedConnection?.connectionId || ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {connections.map((conn: SqlConnection) => (
          <MenuItem key={conn.connectionId} value={conn.connectionId}>
            {conn.connectionName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
SqlConnectionSelect.propTypes = {
  selectedConnection: PropTypes.shape({
    connectionId: PropTypes.string.isRequired,
    connectionName: PropTypes.string.isRequired,
    connectionString: PropTypes.string.isRequired,
    queryHistory: PropTypes.arrayOf(
      PropTypes.shape({
        rowCountResult: PropTypes.number.isRequired, // Number type
        queryHistoryItemId: PropTypes.string.isRequired, // String type
        sql: PropTypes.string.isRequired, // String type
        date: PropTypes.instanceOf(Date).isRequired, // Date type
      }),
    ),
  }),
  onChange: PropTypes.func.isRequired,
};

export default SqlConnectionSelect;
