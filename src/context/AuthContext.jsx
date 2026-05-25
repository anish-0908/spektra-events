import { createContext, useContext, useEffect, useState } from 'react'
import { apiLogin, apiRegister, apiGetMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('ev_token')
      if (token) {
        try {
          const response = await apiGetMe()
          setUser(response.data.user)
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('ev_token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  async function login(email, password) {
    try {
      const response = await apiLogin(email, password)
      const { token, user: userData } = response.data
      localStorage.setItem('ev_token', token)
      setUser(userData)
      return response
    } catch (error) {
      throw error
    }
  }

  async function register(name, email, password) {
    try {
      const response = await apiRegister(name, email, password)
      const { token, user: userData } = response.data
      localStorage.setItem('ev_token', token)
      setUser(userData)
      return response
    } catch (error) {
      throw error
    }
  }

  async function loginWithGoogle() {
    // For now, this is a placeholder - you can implement OAuth later
    throw new Error('Google login not implemented yet')
  }

  function logout() {
    localStorage.removeItem('ev_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
