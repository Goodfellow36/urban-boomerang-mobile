import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { C, API } from '../constants/theme'

export default function PlaidLinkButton({ onSuccess }) {
  const [loading, setLoading] = useState(false)

  const linkCard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/plaid/link-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${global.authToken}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data?.data?.linkToken) {
        Alert.alert('Card Linking', 'Plaid Link opens here in the full native build. Link token received: ' + data.data.linkToken.slice(0, 20) + '...')
        if (onSuccess) onSuccess()
      } else {
        Alert.alert('Error', 'Could not initialize card linking')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server')
    }
    setLoading(false)
  }

  return (
    <TouchableOpacity style={s.btn} onPress={linkCard} disabled={loading}>
      {loading
        ? <ActivityIndicator color={C.ink} />
        : <Text style={s.btnText}>💳  Link Your Card →</Text>
      }
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  btn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 13, width: '100%', alignItems: 'center' },
  btnText: { fontSize: 14, fontWeight: '800', color: C.ink },
})
