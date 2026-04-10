import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { C, apiFetch } from '../../src/constants/theme'

const CATS = ['All', 'Restaurant', 'Coffee', 'Grocery', 'Beauty', 'Gas', 'Other']
const EMOJI = { Restaurant: '🍽', Coffee: '☕', Grocery: '🛒', 'Beauty & Personal Care': '💅', 'Gas Station': '⛽' }
const TIER_COLOR = { gold: C.gold, silver: '#9CA3AF', bronze: '#CD7F32' }

export default function DiscoverScreen() {
  const [retailers, setRetailers] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')

  useEffect(() => {
    apiFetch('/retailers/nearby?lat=33.158&lng=-96.822&radius=50').then(d => {
      if (d?.data) setRetailers(d.data)
      setLoading(false)
    })
  }, [])

  const filtered = cat === 'All' ? retailers : retailers.filter(r => r.category?.toLowerCase().includes(cat.toLowerCase()))

  return (
    <View style={{ flex: 1, backgroundColor: C.ink }}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Find Partners</Text>
        <Text style={s.title}>Discover 🧭</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {CATS.map(c => (
          <TouchableOpacity key={c} style={[s.chip, cat === c && s.chipActive]} onPress={() => setCat(c)}>
            <Text style={[s.chipText, cat === c && s.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.gold} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100 }}>
          <Text style={s.count}>{filtered.length} partner{filtered.length !== 1 ? 's' : ''} nationwide</Text>
          {filtered.map(r => {
            const tc = TIER_COLOR[r.tier] || C.gold
            return (
              <View key={r.id} style={s.card}>
                <View style={[s.icon, { backgroundColor: `${tc}15` }]}>
                  <Text style={{ fontSize: 24 }}>{EMOJI[r.category] || '🏪'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <Text style={s.name}>{r.name}</Text>
                    {r.is_black_owned && <View style={s.blackOwned}><Text style={s.blackOwnedText}>Black-Owned</Text></View>}
                  </View>
                  <Text style={s.meta}>{r.city}{r.state ? `, ${r.state}` : ''} · {r.category}</Text>
                </View>
                <View style={[s.rate, { backgroundColor: `${tc}15`, borderColor: `${tc}40` }]}>
                  <Text style={[s.rateText, { color: tc }]}>{(parseFloat(r.contribution_rate || 0) * 100).toFixed(0)}%</Text>
                </View>
              </View>
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
  title: { fontSize: 32, fontWeight: '800', color: C.cream, letterSpacing: -0.5 },
  filters: { flexGrow: 0, marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.goldDim, borderColor: C.goldBorder2 },
  chipText: { fontSize: 13, fontWeight: '600', color: C.cream35 },
  chipTextActive: { color: C.gold },
  count: { fontSize: 11, color: C.cream35, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 10 },
  icon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: C.cream },
  meta: { fontSize: 12, color: C.cream35 },
  blackOwned: { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2 },
  blackOwnedText: { fontSize: 10, fontWeight: '700', color: C.green },
  rate: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  rateText: { fontSize: 13, fontWeight: '800' },
})
