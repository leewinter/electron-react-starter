import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Typography,
} from '@mui/material';
import {
  DataChannel,
  EventRequest,
  EventResponse,
  SqlExecutionRequestPayload,
  SqlExecutionResponsePayload,
} from '../../../../shared/types/data-channel.d';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import ReportGrid from '../results/sql-result-grid';
import SqlCodeEditor from '../editor/sql-code-editor';
import { SqlConnection } from '../../../../shared/types/sql-connection';
import SqlConnectionIcon from '../connection/sql-connection-icon';
import SqlConnectionSelect from '../connection/sql-connection-select';
import { Stack } from '@mui/material';
import { useEventChannel } from '../../hooks/use-event-channel';
import { useSqlConnections } from '../../hooks/use-sql-connections';
import { useState } from 'react';

export default function SqlQueryComponent({ query, connection }): JSX.Element {
  const [selectedConnection, setSelectedConnection] = useState<SqlConnection | null>(
    connection ?? null,
  );
  const [code, setCode] = useState<string>(query ?? 'select  * from  cyn.Roles');
  const [sqlResults, setSqlResults] = useState<SqlExecutionResponsePayload>();
  const [isEditorExpanded, setIsEditorExpanded] = useState(true);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);

  const { connections, setConnections } = useSqlConnections();
  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_EXECUTE,
  });

  const handleUpdateConnectionHistory = (
    selectedConnection: SqlConnection,
    code: string,
    payload: SqlExecutionResponsePayload,
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
                date: new Date(),
              },
            ],
          }
        : c,
    );
    setConnections(updated);
  };

  const handleExecuteSqlClick = (): void => {
    sendMessage({
      channel: DataChannel.SQL_EXECUTE,
      payload: { sql: code, selectedConnection },
    } as EventRequest<SqlExecutionRequestPayload>);

    onMessage((response: EventResponse<SqlExecutionResponsePayload>) => {
      setSqlResults(response.payload);
      removeListener();

      // Minimize editor and expand results
      setIsEditorExpanded(false);
      setIsResultsExpanded(true);
      if (selectedConnection) {
        handleUpdateConnectionHistory(selectedConnection, code, response.payload);
      }
    });
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
            onClick={handleExecuteSqlClick}
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

SqlQueryComponent.propTypes = {
  query: PropTypes.string,
  connection: PropTypes.shape({
    connectionId: PropTypes.string.isRequired,
    queryHistory: PropTypes.arrayOf(
      PropTypes.shape({
        rowCountResult: PropTypes.number.isRequired,
        queryHistoryItemId: PropTypes.string,
        sql: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
      }),
    ),
  }),
};
