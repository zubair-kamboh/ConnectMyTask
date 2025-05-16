import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles'

const ThemeContext = createContext()

export const ThemeProvider = ({ children, role = 'user' }) => {
  const storageKey = role === 'provider' ? 'providerDarkMode' : 'darkMode'
  const [darkMode, setDarkMode] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initial = stored !== null ? stored === 'true' : prefersDark
    setDarkMode(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [storageKey])

  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem(storageKey, darkMode)
      document.documentElement.classList.toggle('dark', darkMode)
    }
  }, [darkMode, storageKey])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#01A647' },
          secondary: { main: '#214296' },
          background: {
            default: darkMode ? '#0e0f11' : '#f9fafb',
            paper: darkMode ? '#1c1e21' : '#fff',
          },
        },
        typography: { fontFamily: 'Inter, sans-serif' },
      }),
    [darkMode]
  )

  if (darkMode === null) return null

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useDarkMode = () => useContext(ThemeContext)
