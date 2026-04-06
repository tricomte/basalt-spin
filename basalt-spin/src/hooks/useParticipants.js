import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'basalt_spin_participants'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* quota or private mode */
  }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function useParticipants() {
  const [participants, setParticipants] = useState(() =>
    typeof window === 'undefined' ? [] : loadAll()
  )

  useEffect(() => {
    setParticipants(loadAll())
  }, [])

  const addParticipant = useCallback((entry) => {
    const row = {
      id: newId(),
      firstName: entry.firstName,
      lastName: entry.lastName,
      company: entry.company ?? '',
      email: entry.email,
      prize: entry.prize,
      mode: entry.mode,
      timestamp: entry.timestamp || new Date().toISOString(),
    }
    setParticipants((prev) => {
      const next = [...prev, row]
      saveAll(next)
      return next
    })
    fetch('/api/participant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    }).catch(() => {})
    return row
  }, [])

  const clearAll = useCallback(() => {
    saveAll([])
    setParticipants([])
  }, [])

  const exportCsv = useCallback(() => {
    const rows = loadAll()
    const header = ['#', 'First Name', 'Last Name', 'Company', 'Email', 'Prize Won', 'Timestamp']
    const esc = (v) => {
      const s = String(v ?? '')
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
      return s
    }
    const lines = [
      header.join(','),
      ...rows.map((p, i) =>
        [
          i + 1,
          esc(p.firstName),
          esc(p.lastName),
          esc(p.company),
          esc(p.email),
          esc(p.prize),
          esc(p.timestamp),
        ].join(',')
      ),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'basalt-humanix-winners.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return { participants, addParticipant, clearAll, exportCsv, reload: () => setParticipants(loadAll()) }
}
