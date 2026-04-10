import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { C, API } from '../src/constants/theme'

const FIELDS = [
  { key: 'firstName', label: 'First Name', placeholder: 'Marcus' },
  { key: 'lastName', label: 'Last Name', placeholder: 'Williams' },
  { key: 'phone', label: 'Phone Number', placeholder: '5107734565', keyboardType: 'phone-pad' },
  { key: 'city', label: 'City', placeholder: 'Frisco' },
  { key: 'zipCode', label: 'ZIP Code', placeholder: '75034', keyboardType: 'number-pad' },
]

export default function RegisterScreen() {
  const router = useNavigation()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', zipCode: '' })
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.phone) return Alert.alert('Please fill in all required fields')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: form.phone.replace(/\D/g, '') }),
      })
      const data = await res.json()
      if (res.ok) {
        Alert.alert('Welcome to Urban Boomerang! 🔄', 'Your account is created. Sign in to get started.')
        router.navigate('Login')
      } else Alert.alert('Error', data.error || 'Registration failed')
    } catch (e) { Alert.alert('Error', 'Could not connect to server') }
    setLoading(false)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.ink }} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.back} onPress={() => router.goBack()}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={s.title}>Join the{'\n'}<Text style={{ color: C.gold }}>movement.</Text></Text>
      <Text style={s.sub}>Create your account in under a minute.</Text>
      {FIELDS.map(f => (
        <View key={f.key} style={s.group}>
          <Text style={s.label}>{f.label}</Text>
          <TextInput
            style={s.input}
            placeholder={f.placeholder}
            placeholderTextColor={C.cream35}
            keyboardType={f.keyboardType || 'default'}
            value={form[f.key]}
            onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
          />
        </View>
      ))}
      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
        <Text style={s.btnText}>{loading ? 'Creating account...' : 'Create Account →'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate('Login')}>
        <Text style={s.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  content: { padding: 24, paddingTop: 80, paddingBottom: 60 },
  back: { marginBottom: 32 },
  backText: { fontSize: 16, color: C.cream35 },
  title: { fontSize: 44, fontWeight: '800', color: C.cream, letterSpacing: -1, lineHeight: 50, marginBottom: 12 },
  sub: { fontSize: 16, color: C.cream70, lineHeight: 24, marginBottom: 32 },
  group: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: C.cream35, marginBottom: 8 },
  input: { width: '100%', padding: 16, borderRadius: 16, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, fontSize: 16, color: C.cream },
  btn: { width: '100%', padding: 17, borderRadius: 16, backgroundColor: C.gold, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { fontSize: 16, fontWeight: '800', color: C.ink },
  link: { fontSize: 14, color: C.cream35, textAlign: 'center', marginTop: 8 },
})
