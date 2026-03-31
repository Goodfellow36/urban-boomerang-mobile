import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { C, apiFetch, formatMoney, pct, API } from '../../src/constants/theme'

const EMOJI = {
  'Prime Time Youth Foundation': '🏈',
  "O'Neal Community Fund": '🏀',
  'Saysh For Her Foundation': '🏃🏾‍♀️',
  'Urban Scholar Fund': '🎓',
  'ATL Community Land Trust': '🏠',
  'Black Business Launch Fund': '💼',
  'Westside Youth Foundation': '👶',
}

export default function InitiativesScreen() {
  const [initiatives, setInitiatives] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(global.currentUser?.activeInitiativeId || null)

  useEffect(() => {
    apiFetch('/initiatives').then(d => {
      if (d?.data) setInitiatives(d.data)
      setLoading(false)
    })
  }, [])

  const select = async (id, name) => {
    try {
      const res = await fetch(`${API}/initiatives/${id}/select`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${global.authToken}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setActiveId(id)
        if (global.currentUser) global.currentUser.activeInitiativeId = id
        Alert.alert('✅ Initiative Selected', `Your boomerangs will now fund:\n\n${name}`)
      } else Alert.alert('Error', 'Could not select initiative')
    } catch (e) { Alert.alert('Error', e.message) }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.ink }}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Choose Your Cause</Text>
        <Text style={s.title}>Initiatives 🎯</Text>
        <Text style={s.sub}>Select where your boomerangs go. You can change this anytime.</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.gold} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100 }}>
          {initiatives.map(init => {
            const isActive = activeId === init.id
            const emoji = EMOJI[init.name] || '🎯'
            const p = pct(init.raised_amount, init.goal_amount)
            return (
              <TouchableOpacity
                key={init.id}
                style={[s.card, isActive && s.cardActive]}
                onPress={() => !isActive && select(init.id, init.name)}
                activeOpacity={0.85}
              >
                <View style={s.cardTop}>
                  <Text style={{ fontSize: 32 }}>{emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>{init.name}</Text>
                    {init.is_athlete_foundation && init.athlete_name && <Text style={s.athlete}>{init.athlete_name}</Text>}
                  </View>
                  {isActive
                    ? <View style={s.activeBadge}><Text style={s.activeText}>✓ Active</Text></View>
                    : init.is_challenge_active && <View style={s.liveBadge}><Text style={s.liveText}>LIVE</Text></View>
                  }
                </View>
                {init.description && <Text style={s.desc} numberOfLines={2}>{init.description}</Text>}
                <View style={s.bar}><View style={[s.barFill, { width: `${p}%` }]} /></View>
                <View style={s.footer}>
                  <Text style={s.raised}>{formatMoney(init.raised_amount)} raised</Text>
                  {init.goal_amount && <Text style={s.goal}>Goal: ${(parseFloat(init.goal_amount) / 1000).toFixed(0)}K</Text>}
                </View>
                {!isActive && (
                  <View style={s.selectHint}>
                    <Text style={s.selectHintText}>Tap to select this initiative</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: C.gold, opacity: 0.8, marginBottom: 6 },
  title: { fontSize: 32, fontWeight: '800', color: C.cream, letterSpacing: -0.5, marginBottom: 4 },
  sub: { fontSize: 14, color: C.cream35 },
  card: { backgroundColor: C.ink3, borderWidth: 1.5, borderColor: C.border, borderRadius: 20, padding: 20, marginBottom: 14 },
  cardActive: { borderColor: C.goldBorder2, backgroundColor: C.goldDim },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  name: { fontSize: 15, fontWeight: '800', color: C.cream, marginBottom: 2 },
  athlete: { fontSize: 12, color: C.gold },
  desc: { fontSize: 13, color: C.cream35, lineHeight: 19, marginBottom: 12 },
  bar: { height: 4, backgroundColor: C.cream04, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  barFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  raised: { fontSize: 12, color: C.gold, fontWeight: '700' },
  goal: { fontSize: 12, color: C.cream35 },
  activeBadge: { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  activeText: { fontSize: 11, fontWeight: '700', color: C.green },
  liveBadge: { backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder2, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  liveText: { fontSize: 10, fontWeight: '800', color: C.gold, letterSpacing: 1 },
  selectHint: { backgroundColor: 'rgba(201,168,76,0.08)', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  selectHintText: { fontSize: 13, fontWeight: '600', color: C.gold },
})
