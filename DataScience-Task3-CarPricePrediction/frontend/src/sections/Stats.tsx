import { Reveal } from '../components/Reveal'

const STATS = [
  { value: '10', suffix: '+', label: 'Vehicle Attributes' },
  { value: '1', suffix: '', label: 'AI Prediction Engine' },
  { value: 'Fast', suffix: '', label: 'Prediction Response' },
  { value: '24/7', suffix: '', label: 'Available' },
]

export function Stats() {
  return (
    <section aria-label="Product highlights" className="container-x">
      <Reveal>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-6 text-center sm:py-8">
              <dt className="order-2 mt-1 text-sm text-muted">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight">
                {s.value}
                <span className="text-gradient">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
