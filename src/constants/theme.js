export const C = {
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.08)',
  goldBorder: 'rgba(201,168,76,0.2)',
  goldBorder2: 'rgba(201,168,76,0.4)',
  green: '#1DB87A',
  greenDim: 'rgba(29,184,122,0.1)',
  greenBorder: 'rgba(29,184,122,0.25)',
  blue: '#3B82F6',
  red: '#EF4444',
  amber: '#F59E0B',
  ink: '#05080D',
  ink2: '#080C13',
  ink3: '#0D1219',
  ink4: '#111820',
  cream: '#F0EAD8',
  cream70: 'rgba(240,234,216,0.7)',
  cream35: 'rgba(240,234,216,0.35)',
  cream10: 'rgba(240,234,216,0.1)',
  cream04: 'rgba(240,234,216,0.04)',
  border: 'rgba(255,255,255,0.06)',
}

export const API = 'https://api.urbanboomerang.app/v1'

export async function apiFetch(path) {
  try {
    const token = global.authToken
    if (!token) return null
    const res = await fetch(`${API}${path}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.log('API error:', path, e.message)
    return null
  }
}

export function formatMoney(val) {
  return `$${parseFloat(val || 0).toFixed(2)}`
}

export function pct(raised, goal) {
  if (!goal || parseFloat(goal) === 0) return 0
  return Math.min((parseFloat(raised || 0) / parseFloat(goal)) * 100, 100)
}
