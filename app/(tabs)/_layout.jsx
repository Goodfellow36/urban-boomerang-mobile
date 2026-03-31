import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { C } from '../../src/constants/theme'

const TABS = [
  { name: 'home',        icon: '🏠', label: 'Home' },
  { name: 'discover',    icon: '🧭', label: 'Discover' },
  { name: 'initiatives', icon: '🎯', label: 'Give' },
  { name: 'impact',      icon: '📊', label: 'Impact' },
  { name: 'profile',     icon: '👤', label: 'Profile' },
]

export default function TabLayout() {
  return (
    <Tabs
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
      {TABS.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{tab.icon}</Text>,
          }}
        />
      ))}
    </Tabs>
  )
}
