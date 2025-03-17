import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SystemSettings, defaultSettings, useSettings } from '../../hooks/use-settings';

import AiSettingsForm from './ai-deepseek-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SqlFormatterSettings from './sql-formatter-form';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState<SystemSettings>(defaultSettings);
  const { settings, setSettings } = useSettings();
  const [expanded, setExpanded] = useState<'ai' | 'sql' | false>('ai');

  useEffect(() => {
    if (settings !== currentSettings) setCurrentSettings(settings);
  }, [settings]);

  const handleSave = () => {
    setSettings(currentSettings);
    onClose();
  };

  const handleAccordionChange =
    (panel: 'ai' | 'sql') => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Edit Settings</DialogTitle>
      <DialogContent>
        {/* AI Settings Accordion */}
        <Accordion expanded={expanded === 'ai'} onChange={handleAccordionChange('ai')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">AI Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AiSettingsForm settings={currentSettings} onUpdate={setCurrentSettings} />
          </AccordionDetails>
        </Accordion>

        {/* SQL Formatter Settings Accordion */}
        <Accordion expanded={expanded === 'sql'} onChange={handleAccordionChange('sql')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">SQL Formatter Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SqlFormatterSettings settings={currentSettings} onUpdate={setCurrentSettings} />
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
