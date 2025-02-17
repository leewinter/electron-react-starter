import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

import { SqlConnection } from '../../../preload/index.d';
import { useSqlConnections } from '../hooks/use-sql-connections';

type SqlConnectionSelectProps = {
  selectedConnection: SqlConnection | null;
  onChange: (connectionId: string) => void;
};

const SqlConnectionSelect: React.FC<SqlConnectionSelectProps> = ({
  selectedConnection,
  onChange,
}) => {
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const { getItem } = useSqlConnections();

  useEffect(() => {
    const dataLoad = async () => {
      const results = await getItem();
      setConnections(results || []);
    };
    dataLoad();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Select SQL Connection</InputLabel>
      <Select
        value={selectedConnection?.connectionId || ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {connections.map((conn) => (
          <MenuItem key={conn.connectionId} value={conn.connectionId}>
            {conn.connectionName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SqlConnectionSelect;
