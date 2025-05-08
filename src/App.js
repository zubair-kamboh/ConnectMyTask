import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UserPage from './pages/UserProfile'
// import TasksPage from './pages/TasksPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import TaskPage from './pages/TaskPage'
import TaskDetailsPage from './components/TaskDetails'
import ProviderTasks from './pages/ProviderTasks'
import Profile from './components/Provider/Profile'
import { ToastContainer } from 'react-toastify'

function App() {
  const isAuthenticated = localStorage.getItem('token')
  const isProviderAuthenticated = localStorage.getItem('providerToken')

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/provider/profile" element={<Profile />} />

        {isAuthenticated ? (
          <>
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/user/dashboard/profile" element={<UserPage />} />
            <Route path="/user/dashboard/tasks" element={<TaskPage />} />
            <Route path="/user/dashboard/task" element={<TaskDetailsPage />} />
            <Route
              path="*"
              element={<Navigate to="/user/dashboard" replace />}
            />
          </>
        ) : isProviderAuthenticated ? (
          <>
            <Route path="/provider/tasks" element={<ProviderTasks />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
