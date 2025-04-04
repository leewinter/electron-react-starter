import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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

export default SqlConnectionSelect;
