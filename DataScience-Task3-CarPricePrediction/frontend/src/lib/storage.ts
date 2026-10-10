import type { HistoryEntry } from '../types'

const KEY = 'autovalue:history:v1'
const MAX = 200

function isEntry(x: unknown): x is HistoryEntry {
  if (typeof x !== 'object' || x === null) return false
  const e = x as Partial<HistoryEntry>
  return typeof e.id === 'string' && typeof e.createdAt === 'string' && typeof e.predictedPrice === 'number' && typeof e.input === 'object' && e.input !== null
}

export function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(isEntry) : []
  } catch {
    return []
  }
}

export function writeHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)))
  } catch {
    /* storage unavailable (private mode / quota): history simply won't persist */
  }
}
