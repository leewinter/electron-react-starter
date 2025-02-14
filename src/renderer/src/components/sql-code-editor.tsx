import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEventChannel } from '../hooks/use-event-channel';
import { DataChannel } from '../../../preload/index.d';
import { type EventRequest, type EventResponse } from '../../../preload/index.d';
import { IconButton, Tooltip } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';

/**
 * SqlEditor component provides a code editor for writing and formatting SQL queries.
 * It includes a button to format the SQL code using a linting service.
 *
 * @param {Object} props - The properties object.
 * @param {string | undefined} props.code - The initial SQL code to be displayed in the editor.
 * @param {function} props.onChange - Callback function to handle changes in the SQL code.
 *
 * @returns {JSX.Element} The rendered SqlEditor component.
 */
const SqlEditor: React.FC<{
  code: string | undefined;
  onChange: (updatedValue: string) => void;
}> = ({ code, onChange }) => {
  const [currentCode, setCurrentCode] = useState<string | undefined>(code);
  const [codeDirty, setCodeDirty] = useState(false);
  // const [errors, setErrors] = useState('')

  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_LINT,
  });

  useEffect(() => {
    if (code && code !== currentCode) {
      setCurrentCode(code);
    }
  }, [code]);

  const handleLint = async (sql: string | undefined): Promise<void> => {
    sendMessage({ channel: DataChannel.SQL_LINT, payload: { sql } } as EventRequest);
    onMessage((response: EventResponse) => {
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
        style={{ fontSize: 14, backgroundColor: '#f5f5f5', fontFamily: 'monospace' }}
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
