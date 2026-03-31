import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { C, API } from '../src/constants/theme'

export default function LoginScreen() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    if (!phone.trim()) return Alert.alert('Enter your phone number')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, '') }),
      })
      const data = await res.json()
      if (res.ok) setStep('otp')
      else Alert.alert('Error', data.error || 'Could not send code')
    } catch (e) { Alert.alert('Error', 'Could not connect to server') }
    setLoading(false)
  }

  const verifyOtp = async () => {
    if (!otp.trim()) return Alert.alert('Enter the 6-digit code')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), otp: otp.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.data?.accessToken) {
        global.authToken = data.data.accessToken
        global.currentUser = data.data.user
        await AsyncStorage.setItem('authToken', data.data.accessToken)
        await AsyncStorage.setItem('currentUser', JSON.stringify(data.data.user))
        router.replace('/(tabs)/home')
      } else Alert.alert('Error', data.error || 'Invalid code')
    } catch (e) { Alert.alert('Error', e.message) }
    setLoading(false)
  }

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={s.title}>{step === 'phone' ? 'Welcome\nback.' : 'Check your\nphone.'}</Text>
      <Text style={s.sub}>{step === 'phone' ? 'Enter your phone number to sign in.' : 'Enter the 6-digit code from Railway logs.'}</Text>
      {step === 'phone' ? (
        <>
          <TextInput style={s.input} placeholder="5107734565" placeholderTextColor={C.cream35} keyboardType="phone-pad" value={phone} onChangeText={setPhone} autoFocus />
          <TouchableOpacity style={s.btn} onPress={sendOtp} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Sending...' : 'Send Code →'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput style={[s.input, { letterSpacing: 8, fontSize: 28, textAlign: 'center', fontWeight: '800' }]} placeholder="000000" placeholderTextColor={C.cream35} keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} autoFocus />
          <TouchableOpacity style={s.btn} onPress={verifyOtp} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Verifying...' : 'Sign In →'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setStep('phone'); setOtp('') }}>
            <Text style={s.link}>Wrong number? Go back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.ink, padding: 24, paddingTop: 80 },
  back: { marginBottom: 40 },
  backText: { fontSize: 16, color: C.cream35 },
  title: { fontSize: 48, fontWeight: '800', color: C.cream, letterSpacing: -1, lineHeight: 54, marginBottom: 12 },
  sub: { fontSize: 15, color: C.cream70, lineHeight: 24, marginBottom: 40 },
  input: { width: '100%', padding: 18, borderRadius: 16, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, fontSize: 18, color: C.cream, marginBottom: 16 },
  btn: { width: '100%', padding: 17, borderRadius: 16, backgroundColor: C.gold, alignItems: 'center', marginBottom: 16 },
  btnText: { fontSize: 16, fontWeight: '800', color: C.ink },
  link: { fontSize: 14, color: C.cream35, textAlign: 'center', marginTop: 8 },
})
