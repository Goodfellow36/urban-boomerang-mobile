import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { create, open } from 'react-native-plaid-link-sdk'
import { C, API } from '../constants/theme'

export default function PlaidLinkButton({ onSuccess }) {
  const [loading, setLoading] = useState(false)

  const linkCard = useCallback(async () => {
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

      if (!data?.data?.linkToken) {
        Alert.alert('Error', 'Could not initialize card linking')
        setLoading(false)
        return
      }

      create({ token: data.data.linkToken })

      open({
        onSuccess: async (success) => {
          try {
            const exchangeRes = await fetch(`${API}/auth/plaid/exchange-token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${global.authToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ publicToken: success.publicToken }),
            })
            const exchangeData = await exchangeRes.json()
            if (exchangeData?.data) {
              Alert.alert('Success', 'Your card has been linked! You are ready to start boomeranging.')
              if (onSuccess) onSuccess()
            } else {
              Alert.alert('Error', 'Card linking failed. Please try again.')
            }
          } catch (e) {
            Alert.alert('Error', 'Could not complete card linking')
          }
          setLoading(false)
        },
        onExit: (exit) => {
          if (exit.error) {
            Alert.alert('Error', exit.error.displayMessage || 'Something went wrong')
          }
          setLoading(false)
        },
      })
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server')
      setLoading(false)
    }
  }, [])

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
