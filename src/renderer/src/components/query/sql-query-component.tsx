import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataChannel,
  EventRequest,
  EventResponse,
  SqlExecutionRequestPayload,
  SqlExecutionResponsePayload,
} from '../../../../shared/types/data-channel.d';
import { useEffect, useMemo, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportGrid from '../results/sql-result-grid';
import SqlConnectionIcon from '../connection/sql-connection-icon';
import SqlConnectionSelect from '../connection/sql-connection-select';
import SqlEditor from '../editor/sql-code-editor';
import { useEventChannel } from '../../hooks/use-event-channel';
import { useMonaco } from '@monaco-editor/react';
import { useSqlConnections } from '../../hooks/use-sql-connections';

export default function SqlQueryComponent({ initialState, onStateChange }): JSX.Element {
  const [selectedConnection, setSelectedConnection] = useState(initialState.connection || null);
  const [code, setCode] = useState(initialState.query || 'SELECT * FROM cyn.Users');
  const [sqlResults, setSqlResults] = useState<SqlExecutionResponsePayload | undefined>(
    initialState.sqlResults,
  );
  const [isEditorExpanded, setIsEditorExpanded] = useState(initialState.isEditorExpanded ?? true);
  const [isResultsExpanded, setIsResultsExpanded] = useState(
    initialState.isResultsExpanded ?? false,
  );

  const { connections, setConnections } = useSqlConnections();
  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_EXECUTE,
  });

  const monaco = useMonaco();
  const additionalSuggestions = useMemo(() => {
    if (selectedConnection?.tables) {
      return selectedConnection.tables.map((t) => ({
        label: `${t.TableName} (${t.SchemaName})`,
        kind: monaco?.languages.CompletionItemKind.Class,
        insertText: `${t.SchemaName}.${t.TableName}`,
        documentation: `Table containing ${t.TableName}`,
      }));
    }
    return [];
  }, [selectedConnection]);

  // Sync component state to parent when any state changes
  useEffect(() => {
    onStateChange({
      connection: selectedConnection,
      query: code,
      sqlResults,
      isEditorExpanded,
      isResultsExpanded,
    });
  }, [selectedConnection, code, sqlResults, isEditorExpanded, isResultsExpanded]);

  const handleExecuteSqlClick = () => {
    sendMessage({
      channel: DataChannel.SQL_EXECUTE,
      payload: { sql: code, selectedConnection },
    } as EventRequest<SqlExecutionRequestPayload>);

    onMessage((response: EventResponse<SqlExecutionResponsePayload>) => {
      setSqlResults(response.payload);
      removeListener();

      // Expand results, collapse editor
      setIsEditorExpanded(false);
      setIsResultsExpanded(true);
    });
  };

  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <SqlConnectionSelect
          onChange={(connectionId) => {
            const selected = connections.find((c) => c.connectionId === connectionId);
            setSelectedConnection(selected || null);
          }}
          selectedConnection={selectedConnection}
        />
        <SqlConnectionIcon />
      </Stack>

      <Accordion
        expanded={isEditorExpanded}
        onChange={() => setIsEditorExpanded(!isEditorExpanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">SQL Query Editor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SqlEditor code={code} onChange={setCode} additionalSuggestions={additionalSuggestions} />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!selectedConnection || !code}
            onClick={handleExecuteSqlClick}
          >
            Execute
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={isResultsExpanded}
        onChange={() => setIsResultsExpanded(!isResultsExpanded)}
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
