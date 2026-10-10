import { motion } from 'framer-motion'
import { ArrowDown, Brain, Cog, LayoutDashboard, Server, Sparkles, User, type LucideIcon } from 'lucide-react'
import { SectionHeading } from './Reveal'

const NODES: { icon: LucideIcon; label: string; note: string }[] = [
  { icon: User, label: 'User', note: 'Enters vehicle details' },
  { icon: LayoutDashboard, label: 'React Frontend', note: 'Validates and sends the request' },
  { icon: Server, label: 'FastAPI API', note: 'Validates input with Pydantic' },
  { icon: Cog, label: 'Preprocessing Pipeline', note: 'Encodes categorical features' },
  { icon: Brain, label: 'Machine Learning Model', note: 'Random Forest regression' },
  { icon: Sparkles, label: 'Prediction', note: 'Returned as JSON' },
  { icon: LayoutDashboard, label: 'Animated Result', note: 'Rendered and saved to local history' },
]

export function ModelArchitecture() {
  return (
    <section id="architecture" className="container-x pt-24">
      <SectionHeading eyebrow="Architecture" title="How a prediction travels through the system" />
      <ol className="mx-auto flex max-w-md flex-col items-center">
        {NODES.map((n, i) => (
          <motion.li
            key={n.label}
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <n.icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium">{n.label}</p>
                <p className="text-sm text-muted">{n.note}</p>
              </div>
            </div>
            {i < NODES.length - 1 && (
              <motion.span
                aria-hidden="true"
                className="my-1.5 text-accent"
                initial={{ opacity: 0, scaleY: 0.4 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <ArrowDown size={18} />
              </motion.span>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
