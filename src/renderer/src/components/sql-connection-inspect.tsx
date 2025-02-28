import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEventChannel } from '../hooks/use-event-channel';
import {
  DataChannel,
  EventRequest,
  EventResponse,
  SqlConnectionInspectPayload,
} from '../../../shared/types/data-channel.d';

const SqlConnectionInspect: React.FC<SqlConnectionInspectPayload> = ({ connection, onLoaded }) => {
  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_INSPECT_CONNECTION,
  });

  const handleConnectionInspect = async (): Promise<void> => {
    sendMessage({
      channel: DataChannel.SQL_INSPECT_CONNECTION,
      payload: { connection },
    } as EventRequest<SqlConnectionInspectPayload>);
    onMessage((response: EventResponse<SqlConnectionInspectPayload>) => {
      console.log(response.payload);
      if (onLoaded) onLoaded(response.payload);
      removeListener();
    });
  };

  return (
    <div>
      <IconButton
        color="secondary"
        onClick={() => handleConnectionInspect()}
        aria-label="Inspect Schema"
        sx={{ '&:hover': { color: 'primary.main' } }} // Adds hover effect
      >
        <RefreshIcon fontSize="medium" />
      </IconButton>
    </div>
  );
};

export default SqlConnectionInspect;
