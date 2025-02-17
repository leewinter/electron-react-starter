import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import App from './App';
import DashboardPage from './pages/dashboard-page';
import SqlPage from './pages/SqlPage';
import MiniDrawer from './layouts/drawer-layout';

const RouterComponent: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<MiniDrawer />}>
          <Route index element={<DashboardPage />} />
          <Route path="/sql" element={<SqlPage />} />
        </Route>
      </Route>
    </Routes>
  </Router>
);

export default RouterComponent;
