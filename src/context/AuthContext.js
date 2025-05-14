import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const storedProvider = JSON.parse(localStorage.getItem('provider'))

    if (storedUser) setUser(storedUser)
    if (storedProvider) setProvider(storedProvider)

    setLoading(false)
  }, [])

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const loginProvider = (providerData, token) => {
    localStorage.setItem('providerToken', token)
    localStorage.setItem('provider', JSON.stringify(providerData))
    setProvider(providerData)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setProvider(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, provider, loginUser, loginProvider, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
