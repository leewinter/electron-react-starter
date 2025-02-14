import { useState, useEffect } from 'react'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { useEventChannel } from '../hooks/use-event-channel'
import { DataChannel } from '../../../preload/index.d'
import { type EventRequest, type EventResponse } from '../../../preload/index.d'
import { IconButton, Tooltip } from '@mui/material'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'

const SqlEditor = ({
  code,
  onChange
}: {
  code: string | undefined
  onChange: (updatedValue: string) => void
}) => {
  const [currentCode, setCurrentCode] = useState<string | undefined>(code)
  const [codeDirty, setCodeDirty] = useState(false)
  // const [errors, setErrors] = useState('')

  const { sendMessage, onMessage, removeListener } = useEventChannel({
    channel: DataChannel.SQL_LINT
  })

  useEffect(() => {
    if (code && code !== currentCode) {
      setCurrentCode(code)
    }
  }, [code])

  const handleLint = async (sql: string | undefined) => {
    sendMessage({ channel: DataChannel.SQL_LINT, payload: { sql } } as EventRequest)
    onMessage((response: EventResponse) => {
      setCurrentCode(response.payload.sql)
      setCodeDirty(false)
      removeListener()
    })
  }

  return (
    <div>
      <Tooltip title="Format SQL">
        <IconButton onClick={() => handleLint(currentCode)} color="primary" disabled={!codeDirty}>
          <FormatAlignLeftIcon />
        </IconButton>
      </Tooltip>
      <CodeEditor
        value={currentCode}
        language="sql"
        placeholder="Write your SQL query here..."
        onChange={(evn) => {
          setCurrentCode(evn.target.value)
          onChange(evn.target.value)
          setCodeDirty(true)
        }}
        padding={15}
        style={{ fontSize: 14, backgroundColor: '#f5f5f5', fontFamily: 'monospace' }}
      />
      {/* <div style={{ color: errors.includes('✅') ? 'green' : 'red', marginTop: '10px' }}>
        {errors}
      </div> */}
    </div>
  )
}

export default SqlEditor
