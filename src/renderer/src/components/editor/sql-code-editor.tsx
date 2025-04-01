import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useEventChannel } from '../../hooks/use-event-channel';
import {
  type EventRequest,
  type EventResponse,
  DataChannel,
  SqlLintPayload,
} from '../../../../shared/types/data-channel.d';
import { IconButton, Tooltip } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import MonacoEditor from '@monaco-editor/react';
import { useSqlIntellisense } from './hooks/use-sql-intellisense';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@renderer/hooks/use-settings';

const SqlEditor: React.FC<{
  code: string | undefined;
  additionalSuggestions: any;
  onChange: (updatedValue: string) => void;
}> = ({ code, additionalSuggestions, onChange }) => {
  const [currentCode, setCurrentCode] = useState<string | undefined>(code);
  const [codeDirty, setCodeDirty] = useState(true);
  const editorRef = useRef();
  const theme = useTheme();
  const { settings } = useSettings();

  useSqlIntellisense({ additionalSuggestions, editorRef });

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
      payload: { sql, settings: settings.sqlFormatter },
    } as EventRequest<SqlLintPayload>);
    onMessage((response: EventResponse<SqlLintPayload>) => {
      setCurrentCode(response.payload.sql);
      setCodeDirty(false);
      removeListener();
    });
  };

  const onEditorDidMount = (editor, monaco): void => {
    editorRef.current = editor;
    editor.focus();
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
      <MonacoEditor
        theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs'}
        height="400px"
        defaultLanguage="sql"
        value={currentCode}
        defaultValue={currentCode}
        onChange={(value): void => {
          setCurrentCode(value);
          onChange(value ?? '');
          setCodeDirty(true);
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
        onMount={onEditorDidMount}
      />
    </div>
  );
};
SqlEditor.propTypes = {
  code: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SqlEditor;
