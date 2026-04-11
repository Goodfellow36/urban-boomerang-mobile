import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('authToken').then(token => {
      if (token) {
        global.authToken = token
        setIsLoggedIn(true)
      }
      AsyncStorage.getItem('currentUser').then(user => {
        if (user) global.currentUser = JSON.parse(user)
        setLoading(false)
      })
    })
  }, [])

  const login = (token, user) => {
    global.authToken = token
    global.currentUser = user
    setIsLoggedIn(true)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('currentUser')
    global.authToken = null
    global.currentUser = null
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
