import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import React from 'react';
import App from './components/App';
import Layout from './components/layouts/dashboard';
import DashboardPage from './components/pages';
import SqlPage from './components/pages/sql';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'sql',
            Component: SqlPage,
          },
        ],
      },
    ],
  },
]);

const root = createRoot(document.body);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
