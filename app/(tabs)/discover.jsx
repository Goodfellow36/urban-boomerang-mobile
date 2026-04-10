import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { C, apiFetch } from '../../src/constants/theme'

const CATS = ['All', 'Restaurant', 'Coffee', 'Grocery', 'Beauty', 'Gas', 'Other']
const EMOJI = { Restaurant: '🍽', Coffee: '☕', Grocery: '🛒', 'Beauty & Personal Care': '💅', 'Gas Station': '⛽', Apparel: '👟', 'Home Improvement': '🏠' }
const TIER_COLOR = { gold: C.gold, silver: '#9CA3AF', bronze: '#CD7F32' }

export default function DiscoverScreen() {
  const [retailers, setRetailers] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState(false)
  const [cat, setCat] = useState('All')
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    getLocationAndRetailers()
  }, [])

  const getLocationAndRetailers = async () => {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationError(true)
        // Fall back to Frisco TX
        loadRetailers(33.158, -96.822)
        return
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      const { latitude, longitude } = location.coords
      setUserLocation({ latitude, longitude })
      loadRetailers(latitude, longitude)
    } catch (e) {
      setLocationError(true)
      loadRetailers(33.158, -96.822)
    }
  }

  const loadRetailers = async (lat, lng) => {
    const data = await apiFetch(`/retailers/nearby?lat=${lat}&lng=${lng}&radius=50`)
    if (data?.data) setRetailers(data.data)
    setLoading(false)
  }

  const filtered = cat === 'All' ? retailers : retailers.filter(r => r.category?.toLowerCase().includes(cat.toLowerCase()))

  return (
    <View style={{ flex: 1, backgroundColor: C.ink }}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Find Partners</Text>
        <Text style={s.title}>Discover 🧭</Text>
        {locationError && <Text style={s.locationNote}>📍 Using default location — enable location for nearby results</Text>}
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
          <Text style={{ color: C.cream35, marginTop: 12, fontSize: 13 }}>Finding partners near you...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🗺</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.cream, marginBottom: 8 }}>No partners nearby yet</Text>
          <Text style={{ fontSize: 14, color: C.cream35, textAlign: 'center', lineHeight: 22 }}>
            We're growing our network. Check back soon or explore a different category.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100 }}>
          <Text style={s.count}>{filtered.length} partner{filtered.length !== 1 ? 's' : ''} near you</Text>
          {filtered.map(r => {
            const tc = TIER_COLOR[r.tier] || C.gold
            const distanceText = r.distance_km ? `${parseFloat(r.distance_km).toFixed(1)} mi away` : ''
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
                  <Text style={s.meta}>{r.city}{r.state ? `, ${r.state}` : ''}{distanceText ? ` · ${distanceText}` : ''}</Text>
                  <Text style={s.category}>{r.category}</Text>
                </View>
                <View style={[s.rate, { backgroundColor: `${tc}15`, borderColor: `${tc}40` }]}>
                  <Text style={[s.rateText, { color: tc }]}>{(parseFloat(r.contribution_rate || 0) * 100).toFixed(0)}%</Text>
                  <Text style={[s.rateLabel, { color: tc }]}>back</Text>
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
  locationNote: { fontSize: 12, color: C.amber, marginTop: 6 },
  filters: { flexGrow: 0, marginBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.goldDim, borderColor: C.goldBorder2 },
  chipText: { fontSize: 13, fontWeight: '600', color: C.cream35 },
  chipTextActive: { color: C.gold },
  count: { fontSize: 11, color: C.cream35, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.ink3, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 10 },
  icon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: C.cream },
  meta: { fontSize: 12, color: C.cream35, marginBottom: 2 },
  category: { fontSize: 11, color: C.cream35 },
  blackOwned: { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2 },
  blackOwnedText: { fontSize: 10, fontWeight: '700', color: C.green },
  rate: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' },
  rateText: { fontSize: 16, fontWeight: '800' },
  rateLabel: { fontSize: 9, fontWeight: '600', opacity: 0.8 },
})
