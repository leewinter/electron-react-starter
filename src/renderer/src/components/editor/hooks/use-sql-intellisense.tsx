import { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

const EDITOR_LANG = 'sql';
const sqlProviderRegistered = new Set();

export const useSqlIntellisense = ({ additionalSuggestions, editorRef }) => {
  const monaco = useMonaco();
  const providerRef = useRef<monaco.IDisposable | null>(null);

  useEffect(() => {
    // Ensure hooks always run but avoid registration if Monaco isn't ready
    if (!monaco || !editorRef.current) return;

    // Dispose the previous provider before registering a new one
    providerRef.current?.dispose();
    sqlProviderRegistered.delete(EDITOR_LANG);

    providerRef.current = monaco.languages.registerCompletionItemProvider(EDITOR_LANG, {
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
              range,
            },
            {
              label: 'FROM',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'FROM ',
              documentation: 'Specifies the table to query',
              range,
            },
            ...additionalSuggestions.map((n) => ({
              ...n,
              kind: monaco.languages.CompletionItemKind.Class,
              range,
            })),
          ],
        };
      },
    });

    sqlProviderRegistered.add(EDITOR_LANG);

    return () => {
      providerRef.current?.dispose();
      sqlProviderRegistered.delete(EDITOR_LANG);
    };
  }, [monaco, additionalSuggestions]); // Only runs when dependencies change

  return monaco;
};
