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
import PublicRoute from './components/ProtectedRoutes/PublicRoute'
import PrivateRoute from './components/ProtectedRoutes/PrivateRoute'
import 'leaflet/dist/leaflet.css'

function App() {
  const { user, provider, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard/profile"
          element={
            <PrivateRoute role="user">
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard/tasks"
          element={
            <PrivateRoute role="user">
              <TaskPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard/task/:taskId"
          element={
            <PrivateRoute role="user">
              <TaskDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/profile/:providerId"
          element={
            <PrivateRoute role="user">
              <OfferProviderProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/messages"
          element={
            <PrivateRoute role="user">
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/messages/:userId"
          element={
            <PrivateRoute role="user">
              <Messages />
            </PrivateRoute>
          }
        />

        {/* Provider Routes */}
        <Route
          path="/provider/home"
          element={
            <PrivateRoute role="provider">
              <ProviderHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/tasks"
          element={
            <PrivateRoute role="provider">
              <ProviderTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/messages"
          element={
            <PrivateRoute role="provider">
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute role="provider">
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/provider/tasks/:taskId"
          element={
            <PrivateRoute role="provider">
              <ProviderTaskDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/provider/messages/:userId"
          element={
            <PrivateRoute role="provider">
              <Messages />
            </PrivateRoute>
          }
        />

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
