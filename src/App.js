import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Dashboard from './pages/Dashboard'
import UserPage from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import TaskPage from './pages/TaskPage'
import TaskDetailsPage from './components/TaskDetails'
import ProviderTasks from './pages/ProviderTasks'
import Profile from './components/Provider/Profile'
import ProviderTaskDetails from './components/Provider/ProviderTaskDetails'
import OfferProviderProfile from './components/OfferProviderProfile'
import { Toaster } from 'react-hot-toast'
import Messages from './pages/Messages'
import Loader from './components/Loader'
import ProviderHome from './pages/ProviderHome'

function App() {
  const { user, provider, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/provider/profile" element={<Profile />} />

        {user ? (
          <>
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/dashboard/profile" element={<UserPage />} />
            <Route path="/user/dashboard/tasks" element={<TaskPage />} />
            <Route
              path="/user/dashboard/task/:taskId"
              element={<TaskDetailsPage />}
            />
            <Route
              path="/provider/profile/:providerId"
              element={<OfferProviderProfile />}
            />
            <Route path="/user/messages" element={<Messages />} />

            <Route
              path="*"
              element={<Navigate to="/user/dashboard" replace />}
            />
          </>
        ) : provider ? (
          <>
            <Route path="/provider/home" element={<ProviderHome />} />
            <Route path="/provider/tasks" element={<ProviderTasks />} />
            <Route path="/provider/messages" element={<Messages />} />
            <Route
              path="/provider/tasks/:taskId"
              element={<ProviderTaskDetails />}
            />
            <Route
              path="*"
              element={<Navigate to="/provider/tasks" replace />}
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
