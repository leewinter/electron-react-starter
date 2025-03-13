import * as monaco from 'monaco-editor';

import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterComponent from './router-component';
import { loader } from '@monaco-editor/react';

loader.config({
  monaco,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterComponent />
  </React.StrictMode>,
);
