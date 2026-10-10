import { ChevronDown, Loader2, Sparkles } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { cn } from '../lib/utils'
import { labelFor } from '../lib/format'
import type { CategoricalField, VehicleInput } from '../types'
import { Button } from './ui/button'

type Options = Record<CategoricalField, string[]>
type FieldName = keyof VehicleInput
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>

const EMPTY: Values = {
  brand: '', vehicle_age: '', km_driven: '', seller_type: '', fuel_type: '',
  transmission_type: '', mileage: '', engine: '', max_power: '', seats: '',
}

interface NumSpec { name: FieldName; label: string; unit?: string; hint?: string; placeholder: string; min: number; max: number; integer?: boolean; exclusiveMin?: boolean; message: string }

const NUMERIC: NumSpec[] = [
  { name: 'vehicle_age', label: 'Vehicle age', unit: 'years', hint: 'Vehicle age in years', placeholder: '5', min: 0, max: 60, message: 'Enter an age of 0 or more (up to 60 years).' },
  { name: 'km_driven', label: 'Kilometers driven', unit: 'km', placeholder: '45000', min: 0, max: 5_000_000, exclusiveMin: true, message: 'Enter the distance driven (more than 0 km).' },
  { name: 'mileage', label: 'Mileage', unit: 'km/l', hint: 'Fuel efficiency', placeholder: '18.5', min: 0, max: 200, exclusiveMin: true, message: 'Enter a mileage greater than 0.' },
  { name: 'engine', label: 'Engine', unit: 'cc', placeholder: '1197', min: 0, max: 20_000, exclusiveMin: true, message: 'Enter an engine size greater than 0 cc.' },
  { name: 'max_power', label: 'Maximum power', unit: 'bhp', placeholder: '82', min: 0, max: 2_000, exclusiveMin: true, message: 'Enter a power value greater than 0 bhp.' },
  { name: 'seats', label: 'Seats', placeholder: '5', min: 1, max: 14, integer: true, message: 'Enter a whole number of seats between 1 and 14.' },
]

const SELECTS: { name: CategoricalField; label: string; placeholder: string }[] = [
  { name: 'brand', label: 'Brand', placeholder: 'Select a brand' },
  { name: 'seller_type', label: 'Seller type', placeholder: 'Select seller type' },
  { name: 'fuel_type', label: 'Fuel type', placeholder: 'Select fuel type' },
  { name: 'transmission_type', label: 'Transmission type', placeholder: 'Select transmission' },
]

function validate(v: Values): Errors {
  const errors: Errors = {}
  for (const s of SELECTS) if (!v[s.name]) errors[s.name] = `Please select a ${s.label.toLowerCase()}.`
  for (const n of NUMERIC) {
    const raw = v[n.name].trim()
    const num = Number(raw)
    if (raw === '') errors[n.name] = 'This field is required.'
    else if (!Number.isFinite(num)) errors[n.name] = 'Enter a valid number.'
    else if (n.exclusiveMin ? num <= n.min : num < n.min) errors[n.name] = n.message
    else if (num > n.max) errors[n.name] = n.message
    else if (n.integer && !Number.isInteger(num)) errors[n.name] = n.message
  }
  return errors
}

const control =
  'h-11 w-full rounded-lg border bg-surface2/50 px-3 text-sm text-fg placeholder:text-muted/60 outline-none transition ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60'

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

interface Props { options: Options; loading: boolean; onSubmit: (input: VehicleInput) => void }

export function PredictorForm({ options, loading, onSubmit }: Props) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(values)
  const show = (n: FieldName) => (submitted || touched[n] ? errors[n] : undefined)

  const set = (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }))
  const blur = (name: FieldName) => () => setTouched((t) => ({ ...t, [name]: true }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length > 0) {
      const first = [...SELECTS.map((s) => s.name), ...NUMERIC.map((n) => n.name)].find((n) => errors[n])
      if (first) document.getElementById(first)?.focus()
      return
    }
    onSubmit({
      brand: values.brand,
      vehicle_age: Number(values.vehicle_age),
      km_driven: Number(values.km_driven),
      seller_type: values.seller_type,
      fuel_type: values.fuel_type,
      transmission_type: values.transmission_type,
      mileage: Number(values.mileage),
      engine: Number(values.engine),
      max_power: Number(values.max_power),
      seats: Number(values.seats),
    })
  }

  const aria = (n: FieldName, hint?: string) => ({
    'aria-invalid': show(n) ? true : undefined,
    'aria-describedby': show(n) ? `${n}-err` : hint ? `${n}-hint` : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
      <fieldset disabled={loading} className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">Vehicle information</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {SELECTS.map((s) => (
            <Field key={s.name} id={s.name} label={s.label} error={show(s.name)}>
              <div className="relative">
                <select
                  id={s.name}
                  value={values[s.name]}
                  onChange={set(s.name)}
                  onBlur={blur(s.name)}
                  className={cn(control, 'appearance-none pr-9', !values[s.name] && 'text-muted/70', show(s.name) ? 'border-danger' : 'border-border')}
                  {...aria(s.name)}
                >
                  <option value="">{s.placeholder}</option>
                  {options[s.name].map((o) => (
                    <option key={o} value={o}>{labelFor(o)}</option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </Field>
          ))}

          {NUMERIC.map((n) => (
            <Field key={n.name} id={n.name} label={n.label} hint={n.hint} error={show(n.name)}>
              <div className="relative">
                <input
                  id={n.name}
                  type="number"
                  inputMode={n.integer ? 'numeric' : 'decimal'}
                  step={n.integer ? 1 : 'any'}
                  min={n.min}
                  placeholder={n.placeholder}
                  value={values[n.name]}
                  onChange={set(n.name)}
                  onBlur={blur(n.name)}
                  className={cn(control, n.unit && 'pr-14', show(n.name) ? 'border-danger' : 'border-border')}
                  {...aria(n.name, n.hint)}
                />
                {n.unit && <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">{n.unit}</span>}
              </div>
            </Field>
          ))}
        </div>

        <Button type="submit" size="lg" className="mt-8 w-full" aria-live="polite">
          {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}
          {loading ? 'Analyzing Vehicle...' : 'Predict Car Value'}
        </Button>
      </fieldset>
    </form>
  )
}
