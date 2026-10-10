import { useCallback, useEffect, useState } from 'react'
import type { HistoryEntry, VehicleInput } from '../types'
import { readHistory, writeHistory } from '../lib/storage'

/** Newest-first prediction history persisted in localStorage. `loaded` is false until it has been read. */
export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(readHistory())
    setLoaded(true)
  }, [])

  const add = useCallback((input: VehicleInput, predictedPrice: number) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      input,
      predictedPrice,
    }
    setEntries((prev) => {
      const next = [entry, ...prev]
      writeHistory(next)
      return next
    })
    return entry
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      writeHistory(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    writeHistory([])
    setEntries([])
  }, [])

  return { entries, loaded, add, remove, clear }
}
