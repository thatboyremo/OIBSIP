import { BarChart3 } from 'lucide-react'
import { Reveal, SectionHeading } from '../components/Reveal'
import { Card } from '../components/ui/card'
import { modelMetrics } from '../config/modelMetrics'
import { formatMoney } from '../lib/format'

export function ModelPerformance() {
  const items = [
    modelMetrics.mae !== undefined && { label: 'MAE', value: formatMoney(modelMetrics.mae), hint: 'Mean absolute error' },
    modelMetrics.rmse !== undefined && { label: 'RMSE', value: formatMoney(modelMetrics.rmse), hint: 'Root mean squared error' },
    modelMetrics.r2 !== undefined && { label: 'R²', value: modelMetrics.r2.toFixed(3), hint: 'Coefficient of determination' },
  ].filter(Boolean) as { label: string; value: string; hint: string }[]

  return (
    <section id="model-performance" className="container-x pt-24">
      <SectionHeading eyebrow="Evaluation" title="Model Performance" />
      <Reveal>
        {items.length === 0 ? (
          <Card className="mx-auto flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
            <BarChart3 className="text-muted" size={28} aria-hidden="true" />
            <p className="text-muted">Model evaluation metrics will be displayed here after evaluation.</p>
          </Card>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {items.map((m) => (
                <Card key={m.label} className="p-6 text-center">
                  <p className="text-sm text-muted">{m.hint}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums">{m.value}</p>
                  <p className="mt-1 text-xs font-semibold tracking-widest text-accent">{m.label}</p>
                </Card>
              ))}
            </div>
            {modelMetrics.evaluatedOn && <p className="mt-4 text-center text-sm text-muted">Evaluated on: {modelMetrics.evaluatedOn}</p>}
          </div>
        )}
      </Reveal>
    </section>
  )
}
