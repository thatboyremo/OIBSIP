import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatMoney, formatNumber, labelFor, timeAgo } from '../lib/format'
import type { HistoryEntry } from '../types'
import { EmptyState } from './EmptyState'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface Props { entries: HistoryEntry[]; loaded: boolean; onRemove: (id: string) => void; onClear: () => void }

export function PredictionHistory({ entries, loaded, onRemove, onClear }: Props) {
  const [now, setNow] = useState(() => Date.now())
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [])
  useEffect(() => {
    if (!confirming) return
    const t = window.setTimeout(() => setConfirming(false), 4000)
    return () => window.clearTimeout(t)
  }, [confirming])

  if (!loaded) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading history">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    )
  }
  if (entries.length === 0) return <EmptyState />

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{entries.length} saved {entries.length === 1 ? 'prediction' : 'predictions'} (stored in this browser)</p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => (confirming ? (onClear(), setConfirming(false)) : setConfirming(true))}
        >
          <Trash2 size={15} aria-hidden="true" /> {confirming ? 'Click again to confirm' : 'Clear all'}
        </Button>
      </div>
      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.li key={e.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
              <Card className="flex flex-col gap-3 p-4 transition-colors hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="font-semibold">{labelFor(e.input.brand)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatNumber(e.input.vehicle_age)} {e.input.vehicle_age === 1 ? 'year' : 'years'} · {labelFor(e.input.fuel_type)} · {labelFor(e.input.transmission_type)}
                  </p>
                  <p className="mt-1 text-xs text-muted">{timeAgo(e.createdAt, now)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-xl font-semibold tabular-nums text-gradient">{formatMoney(e.predictedPrice)}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(e.id)}
                    aria-label={`Delete ${labelFor(e.input.brand)} prediction from ${timeAgo(e.createdAt, now)}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
