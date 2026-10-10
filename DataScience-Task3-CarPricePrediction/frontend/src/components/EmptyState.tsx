import { History } from 'lucide-react'
import { ButtonLink } from './ui/button'

export function EmptyState({ title = 'No predictions yet', description = 'Your vehicle predictions will appear here after you use the predictor.' }: { title?: string; description?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent"><History size={22} aria-hidden="true" /></span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <ButtonLink to="/predict" className="mt-6">Make Your First Prediction</ButtonLink>
    </div>
  )
}
