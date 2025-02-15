import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { EventRequest, SqlConnection, DataChannel } from '../../../preload/index.d';
import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportGrid from '../components/sql-result-grid';
import SqlCodeEditor from '../components/sql-code-editor';
import SqlConnectionIcon from '../components/sql-connection-icon';
import SqlConnectionSelect from '../components/sql-connection-select';
import { Stack } from '@mui/material';
import { useEventChannel } from '../hooks/use-event-channel';
import { useSqlConnections } from '../hooks/use-sql-connections';

export default function SqlPage(): JSX.Element {
  const [selectedConnection, setSelectedConnection] = useState<SqlConnection | null>(null);
  const [code, setCode] = useState<string>('select  * from  cyn.Roles');
  const [sqlResults, setSqlResults] = useState<any | undefined>(undefined);
  const [isEditorExpanded, setIsEditorExpanded] = useState(true);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);

  const { connections, setConnections } = useSqlConnections();
  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_EXECUTE,
  });

  const handleUpdateConnectionHistory = (
    selectedConnection: SqlConnection,
    code: string,
    payload: { recordset: Array<any> },
  ): void => {
    const updated = connections.map((c: SqlConnection) =>
      c.connectionId === selectedConnection.connectionId
        ? {
            ...selectedConnection,
            queryHistory: [
              ...(selectedConnection.queryHistory || []),
              {
                rowCountResult: payload.recordset.length,
                queryHistoryItemId: crypto.randomUUID(),
                sql: code,
              },
            ],
          }
        : c,
    );
    setConnections(updated);
  };

  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      {/* SQL Connection Select */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <SqlConnectionSelect
          onChange={(connectionId: string): void => {
            const selectedConnectionOption = connections.find(
              (c: SqlConnection) => c.connectionId === connectionId,
            );
            setSelectedConnection(selectedConnectionOption || null);
          }}
          selectedConnection={selectedConnection}
        />
        <SqlConnectionIcon />
      </Stack>

      {/* SQL Code Editor in an Accordion */}
      <Accordion
        expanded={isEditorExpanded}
        onChange={(): void => setIsEditorExpanded((prev: boolean) => !prev)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">SQL Query Editor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SqlCodeEditor code={code} onChange={setCode} />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!selectedConnection || !code}
            onClick={(): void => {
              sendMessage({
                channel: DataChannel.SQL_EXECUTE,
                payload: { sql: code, selectedConnection },
              } as EventRequest);

              onMessage((response) => {
                setSqlResults(response.payload);
                removeListener();

                // Minimize editor and expand results
                setIsEditorExpanded(false);
                setIsResultsExpanded(true);
                if (selectedConnection) {
                  handleUpdateConnectionHistory(selectedConnection, code, response.payload);
                }
              });
            }}
          >
            Execute
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* SQL Result Grid in an Accordion */}
      <Accordion
        expanded={isResultsExpanded}
        onChange={(): void => setIsResultsExpanded((prev: boolean) => !prev)}
      >
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
