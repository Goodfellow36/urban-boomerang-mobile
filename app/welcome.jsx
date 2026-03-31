import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { C } from '../src/constants/theme'

export default function WelcomeScreen() {
  const router = useRouter()
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.ink }} contentContainerStyle={s.content}>
      <View style={s.logoRow}>
        <View style={s.logoIcon}><Text style={{ fontSize: 32 }}>🔄</Text></View>
        <Text style={s.logoText}>Urban Boomerang</Text>
      </View>
      <Text style={s.title}>Your dollars{'\n'}<Text style={{ color: C.gold }}>come back home.</Text></Text>
      <Text style={s.sub}>Every purchase at a participating retailer automatically sends a percentage back to community initiatives. No extra steps.</Text>
      <View style={s.stats}>
        <View style={s.stat}><Text style={[s.statNum, { color: C.gold }]}>$1M+</Text><Text style={s.statLabel}>Boomeranged</Text></View>
        <View style={s.divider} />
        <View style={s.stat}><Text style={[s.statNum, { color: C.green }]}>18K+</Text><Text style={s.statLabel}>Members</Text></View>
        <View style={s.divider} />
        <View style={s.stat}><Text style={[s.statNum, { color: C.gold }]}>7</Text><Text style={s.statLabel}>Initiatives</Text></View>
      </View>
      <TouchableOpacity style={s.btnGold} onPress={() => router.push('/register')}>
        <Text style={s.btnGoldText}>Join the Movement →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btnGhost} onPress={() => router.push('/login')}>
        <Text style={s.btnGhostText}>I already have an account</Text>
      </TouchableOpacity>
      <Text style={s.tagline}>✊🏾 Conscious spending. Real impact.</Text>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  content: { padding: 24, paddingTop: 80, paddingBottom: 60, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 48 },
  logoIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: '800', color: C.cream },
  title: { fontSize: 48, fontWeight: '800', color: C.cream, textAlign: 'center', letterSpacing: -1, lineHeight: 54, marginBottom: 16 },
  sub: { fontSize: 16, color: C.cream70, textAlign: 'center', lineHeight: 26, marginBottom: 40, maxWidth: 320 },
  stats: { flexDirection: 'row', backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 40, width: '100%' },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: C.cream35 },
  divider: { width: 1, backgroundColor: C.border, marginHorizontal: 8 },
  btnGold: { width: '100%', padding: 17, borderRadius: 16, backgroundColor: C.gold, alignItems: 'center', marginBottom: 12 },
  btnGoldText: { fontSize: 16, fontWeight: '800', color: C.ink },
  btnGhost: { width: '100%', padding: 17, borderRadius: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center', marginBottom: 32 },
  btnGhostText: { fontSize: 16, fontWeight: '600', color: C.cream70 },
  tagline: { fontSize: 13, color: C.cream35 },
})
