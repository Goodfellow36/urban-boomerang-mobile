import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { C, apiFetch, formatMoney } from '../../src/constants/theme'

const LB = [
  { rank: 1, emoji: '🦁', name: 'Keisha M.', city: 'Dallas', amount: '342.10' },
  { rank: 2, emoji: '⭐', name: 'DeShawn T.', city: 'Atlanta', amount: '289.44' },
  { rank: 3, emoji: '🔥', name: 'You', city: 'Frisco', amount: '0.00', isMe: true },
  { rank: 4, emoji: '💫', name: 'Tamara J.', city: 'Chicago', amount: '198.20' },
  { rank: 5, emoji: '🌟', name: 'Andre B.', city: 'Houston', amount: '176.50' },
]

export default function ImpactScreen() {
  const [user, setUser] = useState(global.currentUser)
  const [loading, setLoading] = useState(!global.currentUser)

  useEffect(() => {
    if (!global.authToken) return
    apiFetch('/users/me').then(d => { if (d?.data) { setUser(d.data); global.currentUser = d.data }; setLoading(false) })
  }, [])

  const lifetime = parseFloat(user?.lifetimeBoomeranged || 0)

  const share = async () => {
    await Share.share({
      message: `🔄 I've sent ${formatMoney(lifetime)} back to my community through Urban Boomerang.\n\nJoin the movement: https://urbanboomerang.app/r/${user?.referralCode || ''}`,
    })
  }

  if (loading) return <View style={s.center}><ActivityIndicator color={C.gold} size="large" /></View>

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.eyebrow}>Your Impact</Text>
      <Text style={s.bigNum}>{formatMoney(lifetime)}</Text>
      <Text style={s.bigSub}>boomeranged to your community</Text>

      <View style={s.statsGrid}>
        {[
          { label: 'Boomerangs', value: '0', color: C.gold },
          { label: 'Retailers', value: '0', color: C.green },
          { label: 'Initiatives', value: '0', color: C.blue },
          { label: 'Referred', value: '0', color: C.gold },
        ].map(stat => (
          <View key={stat.label} style={s.statBox}>
            <Text style={[s.statNum, { color: stat.color }]}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.shareCard}>
        <Text style={s.shareQuote}>
          "I've sent <Text style={{ color: C.gold, fontWeight: '800' }}>{formatMoney(lifetime)}</Text> back to my community through Urban Boomerang. Join me. 🔄"
        </Text>
        <TouchableOpacity style={s.shareBtn} onPress={share}>
          <Text style={s.shareBtnText}>📤  Share My Impact</Text>
        </TouchableOpacity>
      </View>

      <View style={s.communityCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[s.statNum, { color: C.gold, fontSize: 28 }]}>$84K</Text>
            <Text style={s.statLabel}>this month</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={[s.statNum, { color: C.green, fontSize: 28 }]}>18,432</Text>
            <Text style={s.statLabel}>active members</Text>
          </View>
        </View>
        <View style={s.bar}><View style={[s.barFill, { width: '56%' }]} /></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ fontSize: 11, color: C.gold }}>$1.01M total boomeranged</Text>
          <Text style={{ fontSize: 11, color: C.cream35 }}>Since launch</Text>
        </View>
      </View>

      <Text style={s.sectionLabel}>🏆 TOP CONTRIBUTORS</Text>
      {LB.map((entry, i) => (
        <View key={entry.rank} style={[s.lbRow, entry.isMe && s.lbRowMe]}>
          <Text style={[s.lbRank, i < 2 && { color: C.gold }]}>{entry.rank}</Text>
          <View style={s.lbAvatar}><Text style={{ fontSize: 17 }}>{entry.emoji}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.lbName}>{entry.name}</Text>
            <Text style={s.lbCity}>{entry.city}</Text>
          </View>
          <Text style={s.lbAmount}>${entry.amount}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ink },
  content: { paddingTop: 60, paddingBottom: 100 },
  center: { flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: C.cream35, textAlign: 'center', marginBottom: 8 },
  bigNum: { fontSize: 76, fontWeight: '800', color: C.gold, letterSpacing: -2, lineHeight: 82, textAlign: 'center', marginBottom: 4 },
  bigSub: { fontSize: 14, color: C.cream35, textAlign: 'center', marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  statBox: { flex: 1, minWidth: '44%', backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 },
  statNum: { fontSize: 36, fontWeight: '800', lineHeight: 42, marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.cream35 },
  shareCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 20, padding: 20, alignItems: 'center' },
  shareQuote: { fontSize: 15, fontStyle: 'italic', color: C.cream70, lineHeight: 24, textAlign: 'center', marginBottom: 16 },
  shareBtn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 13, width: '100%', alignItems: 'center' },
  shareBtnText: { fontSize: 14, fontWeight: '800', color: C.ink },
  communityCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 20 },
  bar: { height: 4, backgroundColor: C.cream04, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.cream35, letterSpacing: 1.5, paddingHorizontal: 20, marginBottom: 8 },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.cream04 },
  lbRowMe: { backgroundColor: 'rgba(201,168,76,0.04)' },
  lbRank: { fontSize: 22, fontWeight: '800', color: C.cream35, width: 24 },
  lbAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink3, alignItems: 'center', justifyContent: 'center' },
  lbName: { fontSize: 13, fontWeight: '700', color: C.cream },
  lbCity: { fontSize: 11, color: C.cream35, marginTop: 2 },
  lbAmount: { fontSize: 18, fontWeight: '700', color: C.green },
})
