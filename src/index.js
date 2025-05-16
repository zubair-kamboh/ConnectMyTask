import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { APIProvider } from '@vis.gl/react-google-maps'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProviderThemeProvider } from './context/ProviderThemeContext'
import { BrowserRouter } from 'react-router-dom'

const AppWrapper = () => {
  const providerToken = localStorage.getItem('providerToken')
  const role = providerToken ? 'provider' : 'user'

  return (
    <SocketProvider>
      <AuthProvider>
        <ThemeProvider role={role}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </SocketProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <APIProvider apiKey="AIzaSyCw5oCey7i_yWvKuJVQ-apK_xenWUqgsUY">
      <AppWrapper />
    </APIProvider>
  </React.StrictMode>
)

reportWebVitals()
