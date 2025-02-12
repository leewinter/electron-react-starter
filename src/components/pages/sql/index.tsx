import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { EventRequest, SqlConnection } from '../../../types/events';
import { useCallback, useEffect, useState } from 'react';

import { DataChannel } from '../../../electron/data-channels';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportGrid from '../../sql/sql-result-grid';
import SqlCodeEditor from '../../sql/sql-code-editor';
import SqlConnectionIcon from '../../sql/sql-connection-icon';
import SqlConnectionSelect from '../../sql/sql-connection-select';
import { Stack } from '@mui/material';
import { useEventChannel } from '../../../hooks/use-event-channel';
import { useSqlConnections } from '../../sql/hooks/use-sql-connections';

export default function SqlPage() {
  const [selectedConnection, setSelectedConnection] = useState<SqlConnection | undefined>(
    undefined
  );
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const [code, setCode] = useState<string>('');
  const [sqlResults, setSqlResults] = useState<any | undefined>(undefined);
  const [isEditorExpanded, setIsEditorExpanded] = useState(true);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);

  const { getItem } = useSqlConnections();
  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_EXECUTE,
  });

  useEffect(() => {
    const fetchData = async () => {
      const results = await getItem();
      setConnections(results || []);
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      {/* SQL Connection Select */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <SqlConnectionSelect
          onChange={connectionId => {
            const selectedConnectionOption = connections.find(c => c.connectionId === connectionId);
            setSelectedConnection(selectedConnectionOption);
          }}
          selectedConnection={selectedConnection}
        />
        <SqlConnectionIcon />
      </Stack>

      {/* SQL Code Editor in an Accordion */}
      <Accordion expanded={isEditorExpanded} onChange={() => setIsEditorExpanded(prev => !prev)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">SQL Query Editor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SqlCodeEditor code={code} onChange={setCode} />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!selectedConnection || !code}
            onClick={() => {
              sendMessage({
                channel: DataChannel.SQL_EXECUTE,
                payload: { sql: code, selectedConnection },
              } as EventRequest);

              onMessage(response => {
                setSqlResults(response.payload);
                removeListener();

                // Minimize editor and expand results
                setIsEditorExpanded(false);
                setIsResultsExpanded(true);
              });
            }}
          >
            Execute
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* SQL Result Grid in an Accordion */}
      <Accordion expanded={isResultsExpanded} onChange={() => setIsResultsExpanded(prev => !prev)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Query Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ReportGrid sqlResults={sqlResults} />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
