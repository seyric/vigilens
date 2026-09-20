import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  )
}

export default NotFoundPage
