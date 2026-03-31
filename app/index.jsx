import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Index() {
  const [ready, setReady] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem('authToken').then(token => {
      if (token) {
        global.authToken = token
        setHasToken(true)
      }
      setReady(true)
    })
  }, [])

  if (!ready) return null
  return <Redirect href={hasToken ? '/(tabs)/home' : '/welcome'} />
}
