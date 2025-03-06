import { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';

const EDITOR_LANG = 'sql';
const sqlProviderRegistered = new Set();

export const useSqlIntellisense = () => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco && !sqlProviderRegistered.has('sql')) {
      sqlProviderRegistered.add('sql');

      monaco.languages.registerCompletionItemProvider(EDITOR_LANG, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: [
              {
                label: 'SELECT',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'SELECT ',
                documentation: 'Selects data from a database',
                range: range,
              },
              {
                label: 'FROM',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'FROM ',
                documentation: 'Specifies the table to query',
                range: range,
              },
              {
                label: 'WHERE',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'WHERE ',
                documentation: 'Specifies the constraint to apply',
                range: range,
              },
              //   {
              //     label: 'users',
              //     kind: monaco.languages.CompletionItemKind.Text,
              //     insertText: 'users',
              //     documentation: 'Table containing user information',
              //     range: range,
              //   },
            ],
          };
        },
      });
    }
  }, [monaco]);

  return monaco;
};
