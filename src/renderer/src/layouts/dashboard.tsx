import { Link } from 'react-router-dom';
import { Outlet } from 'react-router';

import React from 'react';

export default function Layout(): React.ReactElement {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/sql">SQL Page</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
