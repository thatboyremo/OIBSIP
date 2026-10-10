import { motion } from 'framer-motion'
import { formatNumber, labelFor } from '../lib/format'
import type { VehicleInput } from '../types'
import { Card } from './ui/card'

export function VehicleSummary({ input }: { input: VehicleInput }) {
  const rows: [string, string][] = [
    ['Brand', labelFor(input.brand)],
    ['Age', `${formatNumber(input.vehicle_age)} ${input.vehicle_age === 1 ? 'year' : 'years'}`],
    ['Kilometers driven', `${input.km_driven.toLocaleString()} km`],
    ['Fuel', labelFor(input.fuel_type)],
    ['Transmission', labelFor(input.transmission_type)],
    ['Seller', labelFor(input.seller_type)],
    ['Mileage', `${formatNumber(input.mileage)} km/l`],
    ['Engine', `${input.engine.toLocaleString()} cc`],
    ['Power', `${formatNumber(input.max_power)} bhp`],
    ['Seats', String(input.seats)],
  ]
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Vehicle Summary</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
        {rows.map(([k, v], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}>
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-0.5 text-sm font-medium">{v}</dd>
          </motion.div>
        ))}
      </dl>
    </Card>
  )
}
