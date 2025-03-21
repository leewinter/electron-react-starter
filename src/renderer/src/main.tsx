import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterComponent from './router-component';
import { loader } from '@monaco-editor/react';

loader.config({
  paths: {
    vs: 'app-asset://zui/node_modules/monaco-editor/min/vs',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterComponent />
  </React.StrictMode>,
);
