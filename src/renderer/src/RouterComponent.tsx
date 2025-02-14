import { Route, HashRouter as Router, Routes } from 'react-router-dom'

import App from './App'
import DashboardPage from './pages/DashboardPage'
import Layout from './layouts/dashboard'
import SqlPage from './pages/SqlPage'

const RouterComponent = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/sql" element={<SqlPage />} />
        </Route>
      </Route>
    </Routes>
  </Router>
)

export default RouterComponent
