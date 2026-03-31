import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RootLayout() {
  useEffect(() => {
    // Restore auth token on app start
    AsyncStorage.getItem('authToken').then(token => {
      if (token) global.authToken = token
    })
    AsyncStorage.getItem('currentUser').then(user => {
      if (user) global.currentUser = JSON.parse(user)
    })
  }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#05080D' } }} />
    </>
  )
}
