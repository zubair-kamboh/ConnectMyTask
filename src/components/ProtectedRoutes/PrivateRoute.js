import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = ({ children, role }) => {
  const { user, provider } = useAuth()

  if (role === 'user' && user) return children
  if (role === 'provider' && provider) return children

  return <Navigate to="/login" replace />
}

export default PrivateRoute
