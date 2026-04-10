import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native'

import { useState, useEffect, useCallback } from 'react'
import { C, apiFetch, formatMoney, pct } from '../../src/constants/theme'

export default function HomeScreen() {
  
  const [user, setUser] = useState(global.currentUser || null)
  const [retailers, setRetailers] = useState([])
  const [initiatives, setInitiatives] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    if (!global.authToken) { ; return }
    const [u, r, i] = await Promise.all([
      apiFetch('/users/me'),
      apiFetch('/retailers/nearby?lat=32.9&lng=-96.8&radius=5000'),
      apiFetch('/initiatives'),
    ])
    if (u?.data) { setUser(u.data); global.currentUser = u.data }
    if (r?.data) setRetailers(Array.isArray(r.data) ? r.data.slice(0, 4) : [])
    if (i?.data) setInitiatives(Array.isArray(i.data) ? i.data.slice(0, 3) : [])
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [])

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator color={C.gold} size="large" />
      <Text style={s.loadingText}>Loading your data...</Text>
    </View>
  )

  const lifetime = parseFloat(user?.lifetimeBoomeranged || 0)

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} tintColor={C.gold} />}>

      <Text style={s.eyebrow}>Good afternoon</Text>
      <Text style={s.title}>{user?.firstName || 'Welcome'} 👋</Text>

      <View style={s.heroCard}>
        <Text style={s.heroLabel}>Lifetime Boomeranged</Text>
        <Text style={s.heroAmount}>{formatMoney(lifetime)}</Text>
        <Text style={s.heroSub}>{lifetime === 0 ? 'Link your card to start boomeranging' : 'sent back to your community 🔄'}</Text>
        <TouchableOpacity style={s.linkBtn} onPress={() => Alert.alert('Link Card', 'Card linking coming in the next update. Your account is ready!')}>
          <Text style={s.linkBtnText}>💳  Link Your Card →</Text>
        </TouchableOpacity>
        {user?.referralCode && (
          <View style={s.referralPill}>
            <Text style={s.referralText}>Your code: {user.referralCode}</Text>
          </View>
        )}
      </View>

      {initiatives.length > 0 && <>
        <Text style={s.sectionLabel}>🎯 COMMUNITY INITIATIVES</Text>
        {initiatives.map(init => (
          <View key={init.id} style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{init.name}</Text>
              <Text style={s.cardSub}>{formatMoney(init.raised_amount)} raised{init.goal_amount ? ` · Goal: $${(parseFloat(init.goal_amount) / 1000).toFixed(0)}K` : ''}</Text>
              {init.goal_amount && <View style={s.bar}><View style={[s.barFill, { width: `${pct(init.raised_amount, init.goal_amount)}%` }]} /></View>}
            </View>
            {init.is_challenge_active && <View style={s.liveBadge}><Text style={s.liveText}>LIVE</Text></View>}
          </View>
        ))}
      </>}

      {retailers.length > 0 && <>
        <Text style={s.sectionLabel}>📍 PARTNER RETAILERS</Text>
        {retailers.map(r => (
          <View key={r.id} style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{r.name}</Text>
              <Text style={s.cardSub}>{r.city} · {r.category}</Text>
            </View>
            <View style={[s.tierBadge, r.tier === 'gold' && s.tierGold]}>
              <Text style={[s.tierText, r.tier === 'gold' && { color: C.gold }]}>
                {r.tier === 'gold' ? '🥇' : r.tier === 'silver' ? '🥈' : '🥉'} {(parseFloat(r.contribution_rate || 0) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </>}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ink },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: C.cream35, marginTop: 16, fontSize: 14 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: C.gold, opacity: 0.8, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: '800', color: C.cream, letterSpacing: -0.5, marginBottom: 24 },
  heroCard: { backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 20, padding: 24, marginBottom: 24, alignItems: 'center' },
  heroLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: C.gold, opacity: 0.8, marginBottom: 8 },
  heroAmount: { fontSize: 60, fontWeight: '800', color: C.gold, letterSpacing: -2, lineHeight: 66, marginBottom: 8 },
  heroSub: { fontSize: 13, color: C.cream35, textAlign: 'center', marginBottom: 16 },
  linkBtn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 13, width: '100%', alignItems: 'center', marginBottom: 12 },
  linkBtnText: { fontSize: 14, fontWeight: '800', color: C.ink },
  referralPill: { backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: C.goldBorder2 },
  referralText: { fontSize: 12, color: C.gold, fontWeight: '700', letterSpacing: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.cream35, letterSpacing: 1.5, marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: C.cream, marginBottom: 3 },
  cardSub: { fontSize: 12, color: C.cream35, marginBottom: 6 },
  bar: { height: 3, backgroundColor: C.cream04, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  barFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  liveBadge: { backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  liveText: { fontSize: 10, fontWeight: '800', color: C.gold, letterSpacing: 1 },
  tierBadge: { backgroundColor: C.ink4, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tierGold: { backgroundColor: C.goldDim, borderColor: C.goldBorder },
  tierText: { fontSize: 12, fontWeight: '700', color: C.cream35 },
})
