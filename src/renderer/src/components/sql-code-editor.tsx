import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEventChannel } from '../hooks/use-event-channel';
import {
  type EventRequest,
  type EventResponse,
  DataChannel,
  SqlLintPayload,
} from '../../../shared/types/data-channel.d';
import { IconButton, Tooltip } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';

import { useTheme } from '@mui/material/styles';

const SqlEditor: React.FC<{
  code: string | undefined;
  onChange: (updatedValue: string) => void;
}> = ({ code, onChange }) => {
  const [currentCode, setCurrentCode] = useState<string | undefined>(code);
  const [codeDirty, setCodeDirty] = useState(true);
  const theme = useTheme();

  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_LINT,
  });

  useEffect(() => {
    if (code && code !== currentCode) {
      setCurrentCode(code);
    }
  }, [code]);

  const handleLint = async (sql: string | undefined): Promise<void> => {
    sendMessage({
      channel: DataChannel.SQL_LINT,
      payload: { sql },
    } as EventRequest<SqlLintPayload>);
    onMessage((response: EventResponse<SqlLintPayload>) => {
      setCurrentCode(response.payload.sql);
      setCodeDirty(false);
      removeListener();
    });
  };

  return (
    <div>
      <Tooltip title="Format SQL">
        <IconButton
          onClick={(): void => {
            handleLint(currentCode);
          }}
          color="primary"
          disabled={!codeDirty}
        >
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <CodeEditor
        value={currentCode}
        language="sql"
        placeholder="Write your SQL query here..."
        onChange={(evn: React.ChangeEvent<HTMLTextAreaElement>): void => {
          setCurrentCode(evn.target.value);
          onChange(evn.target.value);
          setCodeDirty(true);
        }}
        padding={15}
        style={{ fontSize: 14, backgroundColor: theme.palette.grey[50], fontFamily: 'monospace' }}
      />
      {/* <div style={{ color: errors.includes('✅') ? 'green' : 'red', marginTop: '10px' }}>
        {errors}
      </div> */}
    </div>
  );
};
SqlEditor.propTypes = {
  code: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SqlEditor;
