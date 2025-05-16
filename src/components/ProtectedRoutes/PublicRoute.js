import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PublicRoute = ({ children }) => {
  const { user, provider } = useAuth()

  if (user) return <Navigate to="/user/dashboard" replace />
  if (provider) return <Navigate to="/provider/tasks" replace />

  return children
}

export default PublicRoute
