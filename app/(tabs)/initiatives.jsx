import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { C, apiFetch, formatMoney, pct, API } from '../../src/constants/theme'

const CATEGORIES = [
  { key: 'All', icon: '🌟', label: 'All' },
  { key: 'Pro Athletes', icon: '🏆', label: 'Pro Athletes' },
  { key: 'Youth Programs', icon: '👶', label: 'Youth' },
  { key: 'Housing', icon: '🏠', label: 'Housing' },
  { key: 'STEM', icon: '🔬', label: 'STEM' },
  { key: 'Education', icon: '🎓', label: 'Education' },
  { key: 'Business', icon: '💼', label: 'Business' },
]

const EMOJI = {
  'Prime Time Youth Foundation': '🏈',
  "O'Neal Community Fund": '🏀',
  'Saysh For Her Foundation': '🏃🏾‍♀️',
  'Urban Scholar Fund': '🎓',
  'ATL Community Land Trust': '🏠',
  'Black Business Launch Fund': '💼',
  'Westside Youth Foundation': '👶',
}

const ATHLETE = {
  'Prime Time Youth Foundation': 'Deion Sanders Jr.',
  "O'Neal Community Fund": 'Shareef O\'Neal',
  'Saysh For Her Foundation': 'Allyson Felix',
}

export default function InitiativesScreen() {
  const [initiatives, setInitiatives] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeId, setActiveId] = useState(global.currentUser?.activeInitiativeId || null)

  useEffect(() => {
    apiFetch('/initiatives').then(d => {
      if (d?.data) setInitiatives(d.data)
      setLoading(false)
    })
  }, [])

  const filtered = selectedCategory === 'All'
    ? initiatives
    : initiatives.filter(i => i.category === selectedCategory)

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
      } else {
        Alert.alert('Error', 'Could not select initiative')
      }
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.ink }}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.eyebrow}>Choose Your Cause</Text>
        <Text style={s.title}>Give 🎯</Text>
        <Text style={s.sub}>Select where your boomerangs go. Change anytime.</Text>
      </View>

      {/* Category filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[s.chip, selectedCategory === cat.key && s.chipActive]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
            <Text style={[s.chipText, selectedCategory === cat.key && s.chipTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category header */}
      {selectedCategory !== 'All' && (
        <View style={s.categoryHeader}>
          <Text style={s.categoryTitle}>
            {CATEGORIES.find(c => c.key === selectedCategory)?.icon} {selectedCategory}
          </Text>
          <Text style={s.categoryCount}>{filtered.length} initiative{filtered.length !== 1 ? 's' : ''}</Text>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.gold} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔜</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.cream, marginBottom: 8 }}>Coming Soon</Text>
          <Text style={{ fontSize: 14, color: C.cream35, textAlign: 'center' }}>
            {selectedCategory} initiatives are being added. Check back soon.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100 }}>
          {filtered.map(init => {
            const isActive = activeId === init.id
            const emoji = EMOJI[init.name] || '🎯'
            const athlete = ATHLETE[init.name]
            const p = pct(init.raised_amount, init.goal_amount)

            return (
              <TouchableOpacity
                key={init.id}
                style={[s.card, isActive && s.cardActive]}
                onPress={() => !isActive && select(init.id, init.name)}
                activeOpacity={0.85}
              >
                <View style={s.cardTop}>
                  <View style={s.emojiWrap}>
                    <Text style={{ fontSize: 28 }}>{emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.name}>{init.name}</Text>
                    {athlete && <Text style={s.athlete}>{athlete}</Text>}
                    {init.category && (
                      <View style={s.catBadge}>
                        <Text style={s.catBadgeText}>{init.category}</Text>
                      </View>
                    )}
                  </View>
                  {isActive
                    ? <View style={s.activeBadge}><Text style={s.activeText}>✓ Active</Text></View>
                    : init.is_challenge_active && <View style={s.liveBadge}><Text style={s.liveText}>LIVE</Text></View>
                  }
                </View>

                {init.description && (
                  <Text style={s.desc} numberOfLines={2}>{init.description}</Text>
                )}

                <View style={s.bar}><View style={[s.barFill, { width: `${p}%` }]} /></View>
                <View style={s.footer}>
                  <Text style={s.raised}>{formatMoney(init.raised_amount)} raised</Text>
                  {init.goal_amount && <Text style={s.goal}>Goal: ${(parseFloat(init.goal_amount) / 1000).toFixed(0)}K</Text>}
                </View>

                {!isActive && (
                  <View style={s.selectHint}>
                    <Text style={s.selectHintText}>Tap to select → your boomerangs fund this</Text>
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
  filters: { flexGrow: 0, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.goldDim, borderColor: C.goldBorder2 },
  chipText: { fontSize: 13, fontWeight: '600', color: C.cream35 },
  chipTextActive: { color: C.gold },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  categoryTitle: { fontSize: 16, fontWeight: '800', color: C.cream },
  categoryCount: { fontSize: 12, color: C.cream35 },
  card: { backgroundColor: C.ink3, borderWidth: 1.5, borderColor: C.border, borderRadius: 20, padding: 20, marginBottom: 14 },
  cardActive: { borderColor: C.goldBorder2, backgroundColor: C.goldDim },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  emojiWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.goldDim, borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '800', color: C.cream, marginBottom: 3 },
  athlete: { fontSize: 12, color: C.gold, marginBottom: 4 },
  catBadge: { backgroundColor: C.cream04, borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  catBadgeText: { fontSize: 10, fontWeight: '700', color: C.cream35 },
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
