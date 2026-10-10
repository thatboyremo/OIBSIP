import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardStats } from '../components/DashboardStats'
import { EmptyState } from '../components/EmptyState'
import { Reveal } from '../components/Reveal'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { CURRENCY, CURRENCY_LOCALE, PRICE_MULTIPLIER } from '../config'
import { useHistory } from '../hooks/useHistory'
import { useTheme } from '../hooks/useTheme'
import { formatMoney, labelFor } from '../lib/format'

interface Point { label: string; price: number; brand: string; when: string }

const compact = new Intl.NumberFormat(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY, notation: 'compact', maximumFractionDigits: 1 })

function ChartTip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload: Point }> }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-soft">
      <p className="font-medium">{p.brand}</p>
      <p className="tabular-nums text-accent">{formatMoney(p.price)}</p>
      <p className="text-xs text-muted">{p.when}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { entries, loaded } = useHistory()
  const { theme } = useTheme()
  const stroke = theme === 'dark' ? '#60a5fa' : '#2563eb'
  const grid = theme === 'dark' ? '#2a2a34' : '#e1e4ec'
  const axis = theme === 'dark' ? '#969aaa' : '#646c80'

  const data: Point[] = [...entries].reverse().map((e, i) => ({
    label: `#${i + 1}`,
    price: e.predictedPrice,
    brand: labelFor(e.input.brand),
    when: new Date(e.createdAt).toLocaleString(),
  }))

  return (
    <div className="container-x py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mb-8 mt-2 text-muted">A summary of the predictions saved in this browser.</p>

      {!loaded ? (
        <div className="space-y-5" role="status" aria-label="Loading dashboard">
          <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32" />)}</div>
          <Skeleton className="h-80" />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState description="Your prediction activity and statistics will appear here after you use the predictor." />
      ) : (
        <div className="space-y-5">
          <DashboardStats entries={entries} />
          <Reveal>
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold">Prediction Activity</h2>
              <p className="mb-4 text-sm text-muted">Predicted price for each prediction, oldest to newest.</p>
              <div className="h-64 w-full sm:h-80" role="img" aria-label={`Area chart of ${data.length} saved predictions`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" stroke={axis} tick={{ fontSize: 12 }} tickLine={false} minTickGap={16} />
                    <YAxis stroke={axis} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={56} tickFormatter={(v: number) => compact.format(v * PRICE_MULTIPLIER)} />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: axis, strokeOpacity: 0.3 }} />
                    <Area type="monotone" dataKey="price" stroke={stroke} strokeWidth={2} fill="url(#fillPrice)" dot={{ r: 3, fill: stroke }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Reveal>
        </div>
      )}
    </div>
  )
}
