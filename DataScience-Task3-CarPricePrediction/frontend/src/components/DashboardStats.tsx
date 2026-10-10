import { Hash, Sigma, Zap, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { formatMoney, labelFor, timeAgo } from '../lib/format'
import type { HistoryEntry } from '../types'
import { Reveal } from './Reveal'
import { HoverCard } from './ui/card'

function Stat({ icon: Icon, label, children, sub }: { icon: LucideIcon; label: string; children: ReactNode; sub?: string }) {
  return (
    <HoverCard className="h-full p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent"><Icon size={18} aria-hidden="true" /></span>
        <h3 className="text-sm text-muted">{label}</h3>
      </div>
      <p className="text-3xl font-semibold tabular-nums tracking-tight">{children}</p>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </HoverCard>
  )
}

export function DashboardStats({ entries }: { entries: HistoryEntry[] }) {
  const latest = entries[0]
  const average = entries.reduce((s, e) => s + e.predictedPrice, 0) / entries.length
  const total = useCountUp(entries.length, true, 700)
  const latestShown = useCountUp(latest.predictedPrice, true, 1000)
  const avgShown = useCountUp(average, true, 1000)

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Reveal><Stat icon={Hash} label="Total Predictions">{Math.round(total)}</Stat></Reveal>
      <Reveal delay={0.08}>
        <Stat icon={Zap} label="Latest Prediction" sub={`${labelFor(latest.input.brand)} · ${timeAgo(latest.createdAt)}`}>{formatMoney(latestShown)}</Stat>
      </Reveal>
      <Reveal delay={0.16}><Stat icon={Sigma} label="Average Predicted Value">{formatMoney(avgShown)}</Stat></Reveal>
    </div>
  )
}
