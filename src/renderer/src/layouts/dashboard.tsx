import { Link } from 'react-router-dom'
import { Outlet } from 'react-router'

export default function Layout() {
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
  )
}
