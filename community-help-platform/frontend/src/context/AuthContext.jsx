// src/context/AuthContext.jsx
//
// React Context that manages the logged-in user across the entire app.
// The user object is persisted in localStorage so it survives page refreshes.
//
// Usage anywhere in the app:
//   import { useAuth } from '../context/AuthContext'
//   const { currentUser, login, logout } = useAuth()

import { createContext, useContext, useState } from 'react'

// 1. Create the context (just a container — no data yet)
const AuthContext = createContext(null)

// 2. Provider component — wraps the entire app and holds the state
export function AuthProvider({ children }) {
  // Try to load a previously logged-in user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('community_help_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Called after a successful login or register API response
  const login = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('community_help_user', JSON.stringify(userData))
  }

  // Called when user clicks "Log out"
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('community_help_user')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — shortcut to use the context in any component
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
