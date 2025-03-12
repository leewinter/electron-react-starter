import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import localforage from 'localforage';

const SETTINGS_KEY = 'SETTINGS_KEY';

export type SqlFormatterSettings = {
  tabWidth: number;
  useTabs: boolean;
  keywordCase: 'upper' | 'lower';
  dataTypeCase: 'upper' | 'lower';
  functionCase: 'upper' | 'lower';
  identifierCase: 'upper' | 'lower';
  logicalOperatorNewline: 'before' | 'after';
  expressionWidth: number;
  linesBetweenQueries: number;
  denseOperators: boolean;
  newlineBeforeSemicolon: boolean;
};

export type AiSettings = {
  deepSeekApiKey: string;
};

export type SystemSettings = {
  ai: AiSettings;
  sqlFormatter: SqlFormatterSettings;
};

// Default system settings
export const defaultSettings: SystemSettings = {
  ai: {
    deepSeekApiKey: '',
  },
  sqlFormatter: {
    tabWidth: 2,
    useTabs: false,
    keywordCase: 'upper',
    dataTypeCase: 'upper',
    functionCase: 'upper',
    identifierCase: 'upper',
    logicalOperatorNewline: 'before',
    expressionWidth: 50,
    linesBetweenQueries: 1,
    denseOperators: false,
    newlineBeforeSemicolon: false,
  },
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings } = useQuery({
    queryKey: [SETTINGS_KEY],
    queryFn: async () => {
      try {
        const value = await localforage.getItem<SystemSettings>(SETTINGS_KEY);
        return value ?? defaultSettings;
      } catch (err) {
        console.error(err);
        return defaultSettings;
      }
    },
  });

  const { mutate: setSettings } = useMutation({
    mutationFn: async (key: SystemSettings) => {
      try {
        await localforage.setItem(SETTINGS_KEY, key);
        return key;
      } catch (err) {
        console.error(err);
        return key;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_KEY] });
    },
  });

  return { settings, setSettings };
};
