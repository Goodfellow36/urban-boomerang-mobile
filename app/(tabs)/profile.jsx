import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { C, formatMoney } from '../../src/constants/theme'

const DEI = [
  { company: 'Target', color: C.green, status: 'DEI Active ✓' },
  { company: 'Costco', color: C.green, status: 'Maintained ✓' },
  { company: "McDonald's", color: C.amber, status: 'Under Review' },
  { company: 'Walmart', color: C.red, status: 'DEI Reduced' },
  { company: 'Ford', color: C.red, status: 'Eliminated' },
]

export default function ProfileScreen() {
  const router = useNavigation()
  const user = global.currentUser
  const [notifs, setNotifs] = useState(true)
  const lifetime = parseFloat(user?.lifetimeBoomeranged || 0)

  const logout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('authToken')
        await AsyncStorage.removeItem('currentUser')
        global.authToken = null
        global.currentUser = null
        if (global._logoutCallback) {
          global._logoutCallback()
        }
      }},
    ])
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={s.hero}>
        <View style={s.avatar}><Text style={{ fontSize: 30 }}>👤</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={s.since}>Urban Boomerang Member</Text>
          <View style={s.goldBadge}><Text style={s.goldBadgeText}>🏆 Gold Status</Text></View>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={[s.statNum, { color: C.gold }]}>{formatMoney(lifetime)}</Text>
          <Text style={s.statLabel}>lifetime boomeranged</Text>
        </View>
        <View style={s.divider} />
        <View style={s.stat}>
          <Text style={[s.statNum, { color: C.green }]}>0</Text>
          <Text style={s.statLabel}>friends referred</Text>
        </View>
      </View>

      {user?.referralCode && (
        <View style={s.referralCard}>
          <Text style={s.referralLabel}>Your Referral Code</Text>
          <Text style={s.referralCode}>{user.referralCode}</Text>
          <Text style={s.referralSub}>Share and both earn a bonus when they make their first purchase</Text>
        </View>
      )}

      <Text style={s.sectionLabel}>🔍 DEI CORPORATE SCORECARD</Text>
      <View style={s.scoreCard}>
        {DEI.map((d, i) => (
          <View key={d.company} style={[s.scoreRow, i === DEI.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[s.dot, { backgroundColor: d.color }]} />
            <Text style={s.company}>{d.company}</Text>
            <Text style={[s.status, { color: d.color }]}>{d.status}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionLabel}>SETTINGS</Text>
      <View style={s.settingsCard}>
        <View style={s.settingRow}>
          <Text style={s.settingIcon}>🔔</Text>
          <Text style={s.settingLabel}>Notifications</Text>
          <Switch value={notifs} onValueChange={setNotifs} thumbColor={C.ink} trackColor={{ false: C.cream10, true: C.gold }} />
        </View>
        <TouchableOpacity style={s.settingRow} onPress={() => Alert.alert('KYC', 'Identity verification coming soon')}>
          <Text style={s.settingIcon}>🪪</Text>
          <Text style={s.settingLabel}>Identity Verification</Text>
          <Text style={s.arrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.settingRow, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Disputes', 'Dispute center coming soon')}>
          <Text style={s.settingIcon}>⚖️</Text>
          <Text style={s.settingLabel}>Disputes</Text>
          <Text style={s.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={logout}>
        <Text style={s.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <Text style={s.version}>Urban Boomerang v1.0.0</Text>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ink },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, paddingTop: 60 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: C.goldDim, borderWidth: 1.5, borderColor: C.goldBorder2, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: C.cream, marginBottom: 2 },
  since: { fontSize: 12, color: C.cream35, marginBottom: 8 },
  goldBadge: { backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  goldBadgeText: { fontSize: 11, fontWeight: '700', color: C.gold },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginBottom: 3 },
  statLabel: { fontSize: 11, color: C.cream35, textAlign: 'center' },
  divider: { width: 1, backgroundColor: C.border, marginHorizontal: 8 },
  referralCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 16, padding: 20 },
  referralLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: C.gold, opacity: 0.8, marginBottom: 8 },
  referralCode: { fontSize: 36, fontWeight: '800', color: C.gold, letterSpacing: 4, marginBottom: 4 },
  referralSub: { fontSize: 13, color: C.cream35, lineHeight: 18 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: C.cream35, paddingHorizontal: 20, marginBottom: 10, marginTop: 4 },
  scoreCard: { marginHorizontal: 20, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.cream04, gap: 12 },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  company: { flex: 1, fontSize: 14, fontWeight: '600', color: C.cream },
  status: { fontSize: 12, fontWeight: '600' },
  settingsCard: { marginHorizontal: 20, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.cream04 },
  settingIcon: { fontSize: 18, marginRight: 12 },
  settingLabel: { flex: 1, fontSize: 15, color: C.cream },
  arrow: { fontSize: 16, color: C.cream35 },
  logoutBtn: { marginHorizontal: 20, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  logoutText: { fontSize: 15, color: C.cream35 },
  version: { textAlign: 'center', fontSize: 12, color: C.cream35, paddingBottom: 20 },
})
