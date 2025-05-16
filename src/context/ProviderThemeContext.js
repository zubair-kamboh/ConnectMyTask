import { createContext, useContext, useEffect, useState } from 'react'

const ProviderThemeContext = createContext()

export const ProviderThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('providerDarkMode')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initial = stored !== null ? stored === 'true' : prefersDark
    setDarkMode(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem('providerDarkMode', darkMode)
      document.documentElement.classList.toggle('dark', darkMode)
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  if (darkMode === null) return null

  return (
    <ProviderThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ProviderThemeContext.Provider>
  )
}

export const useProviderDarkMode = () => useContext(ProviderThemeContext)
