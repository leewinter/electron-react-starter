import { Box, Container, Tab, Tabs } from '@mui/material';
import { useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import SqlQueryComponent from '../components/query/sql-query-component';

interface TabData {
  id: number;
  label: string;
}

export default function SqlPage(): JSX.Element {
  const [tabs, setTabs] = useState<TabData[]>([{ id: 0, label: 'Query 1' }]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabStates, setTabStates] = useState<Record<number, any>>({});

  const handleAddTab = () => {
    const newTabId = tabs.length ? Math.max(...tabs.map((t) => t.id)) + 1 : 0;
    setTabs([...tabs, { id: newTabId, label: `Query ${newTabId + 1}` }]);
    setActiveTab(newTabId);
    setTabStates((prev) => ({ ...prev, [newTabId]: {} })); // Initialize empty state
  };

  const handleCloseTab = (tabId: number) => {
    setTabs(tabs.filter((tab) => tab.id !== tabId));
    setTabStates((prev) => {
      const newState = { ...prev };
      delete newState[tabId];
      return newState;
    });
    if (tabs.length > 1) setActiveTab(tabs[tabs.length - 2].id);
  };

  const tabComponents = useMemo(() => {
    return tabs.reduce(
      (acc, tab) => {
        acc[tab.id] = (
          <SqlQueryComponent
            key={tab.id}
            initialState={tabStates[tab.id] || {}}
            onStateChange={(newState) => setTabStates((prev) => ({ ...prev, [tab.id]: newState }))}
          />
        );
        return acc;
      },
      {} as Record<number, JSX.Element>,
    );
  }, [tabs, tabStates]);

  return (
    <Container sx={{ mt: 3 }} maxWidth={false}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>{tab.label}</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                  style={{
                    marginLeft: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CloseIcon fontSize="small" />
                </div>
              </Box>
            }
            value={tab.id}
          />
        ))}
        <Tab label="+" onClick={handleAddTab} />
      </Tabs>

      <Box sx={{ mt: 2 }}>{tabComponents[activeTab]}</Box>
    </Container>
  );
}
