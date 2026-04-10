import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { View, Text, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import WelcomeScreen from './app/welcome'
import LoginScreen from './app/login'
import RegisterScreen from './app/register'
import HomeScreen from './app/(tabs)/home'
import DiscoverScreen from './app/(tabs)/discover'
import InitiativesScreen from './app/(tabs)/initiatives'
import ImpactScreen from './app/(tabs)/impact'
import ProfileScreen from './app/(tabs)/profile'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const C = {
  gold: '#C9A84C',
  ink: '#05080D',
  ink2: '#080C13',
  cream: '#F0EAD8',
  cream35: 'rgba(240,234,216,0.35)',
  border: 'rgba(255,255,255,0.06)',
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.ink2,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.cream35,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧭</Text> }} />
      <Tab.Screen name="Give" component={InitiativesScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎯</Text> }} />
      <Tab.Screen name="Impact" component={ImpactScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem('authToken')
        const user = await AsyncStorage.getItem('currentUser')
        if (token) {
          global.authToken = token
          setIsLoggedIn(true)
        }
        if (user) {
          global.currentUser = JSON.parse(user)
        }
      } catch(e) {
        console.log('Session restore error:', e.message)
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.gold} size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: C.ink } }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
