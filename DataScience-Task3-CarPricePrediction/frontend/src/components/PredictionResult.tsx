import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp'
import { MODEL_CURRENCY, CURRENCY, PRICE_MULTIPLIER } from '../config'
import { formatMoney } from '../lib/format'
import type { VehicleInput } from '../types'
import { Card } from './ui/card'
import { VehicleSummary } from './VehicleSummary'

interface Props { price: number; input: VehicleInput; previousPrices: number[] }

export function PredictionResult({ price, input, previousPrices }: Props) {
  const shown = useCountUp(price, true, 1300)

  // The model returns a single price, so no range/confidence is shown. The only comparison offered is
  // against the user's own previous (real) predictions stored on this device.
  const all = [...previousPrices, price]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const pos = max === min ? 50 : ((price - min) / (max - min)) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-5">
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-muted">Estimated Market Value</p>
        <p className="relative mt-2 text-4xl font-semibold tabular-nums tracking-tight text-gradient sm:text-5xl" aria-label={`Estimated market value ${formatMoney(price)}`}>
          {formatMoney(shown)}
        </p>
        <p className="relative mt-3 text-sm text-muted">Based on the vehicle details you provided.</p>
        {PRICE_MULTIPLIER !== 1 && (
          <p className="relative mt-1 text-xs text-muted">
            Model output ({MODEL_CURRENCY}) converted to {CURRENCY} at {PRICE_MULTIPLIER} per 1 {MODEL_CURRENCY}.
          </p>
        )}

        {previousPrices.length > 0 && (
          <div className="relative mt-7">
            <p className="mb-2 flex items-center gap-1.5 text-xs text-muted">
              <TrendingUp size={14} aria-hidden="true" /> Compared with your previous predictions on this device
            </p>
            <div role="img" aria-label={`This estimate sits ${Math.round(pos)} percent of the way between your lowest and highest predictions`} className="relative h-2 rounded-full bg-surface2">
              <motion.span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-gradient-to-br from-accent to-accent2 shadow-glow"
                initial={{ left: '0%' }}
                animate={{ left: `${pos}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted tabular-nums">
              <span>{formatMoney(min)}</span>
              <span>{formatMoney(max)}</span>
            </div>
          </div>
        )}
      </Card>
      <VehicleSummary input={input} />
    </motion.div>
  )
}
