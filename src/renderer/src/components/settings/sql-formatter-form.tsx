import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import React from 'react';
import { SystemSettings } from '../../hooks/use-settings';

interface SqlFormatterSettingsFormProps {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

const SqlFormatterSettingsForm: React.FC<SqlFormatterSettingsFormProps> = ({
  settings,
  onUpdate,
}) => {
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onUpdate({
      ...settings,
      sqlFormatter: { ...settings.sqlFormatter, [name]: value === '' ? '' : Number(value) },
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...settings,
      sqlFormatter: { ...settings.sqlFormatter, [event.target.name]: event.target.checked },
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>, field: string) => {
    onUpdate({
      ...settings,
      sqlFormatter: { ...settings.sqlFormatter, [field]: event.target.value },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <TextField
        label="Tab Width"
        name="tabWidth"
        type="number"
        value={settings.sqlFormatter.tabWidth}
        onChange={handleNumberChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.sqlFormatter.useTabs}
            onChange={handleCheckboxChange}
            name="useTabs"
          />
        }
        label="Use Tabs"
      />

      {['keywordCase', 'dataTypeCase', 'functionCase', 'identifierCase'].map((field) => (
        <FormControl key={field} fullWidth>
          <InputLabel>{field.replace(/([A-Z])/g, ' $1')}</InputLabel>
          <Select
            label={field.replace(/([A-Z])/g, ' $1')}
            value={settings.sqlFormatter[field]}
            onChange={(e) => handleSelectChange(e, field)}
          >
            <MenuItem value="upper">Uppercase</MenuItem>
            <MenuItem value="lower">Lowercase</MenuItem>
          </Select>
        </FormControl>
      ))}

      <FormControl fullWidth>
        <InputLabel>Logical Operator Newline</InputLabel>
        <Select
          label="Logical Operator Newline"
          value={settings.sqlFormatter.logicalOperatorNewline}
          onChange={(e) => handleSelectChange(e, 'logicalOperatorNewline')}
        >
          <MenuItem value="before">Before</MenuItem>
          <MenuItem value="after">After</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Expression Width"
        name="expressionWidth"
        type="number"
        value={settings.sqlFormatter.expressionWidth}
        onChange={handleNumberChange}
      />

      <TextField
        label="Lines Between Queries"
        name="linesBetweenQueries"
        type="number"
        value={settings.sqlFormatter.linesBetweenQueries}
        onChange={handleNumberChange}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={settings.sqlFormatter.denseOperators}
            onChange={handleCheckboxChange}
            name="denseOperators"
          />
        }
        label="Dense Operators"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.sqlFormatter.newlineBeforeSemicolon}
            onChange={handleCheckboxChange}
            name="newlineBeforeSemicolon"
          />
        }
        label="Newline Before Semicolon"
      />
    </Box>
  );
};

export default SqlFormatterSettingsForm;
