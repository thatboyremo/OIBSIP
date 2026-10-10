import { Brain, Database, MonitorSmartphone, MousePointerClick, ScanSearch, Zap } from 'lucide-react'
import { Reveal, SectionHeading } from '../components/Reveal'
import { HoverCard } from '../components/ui/card'

const FEATURES = [
  { icon: Brain, title: 'AI Price Prediction', text: 'Get an estimated selling price from the trained regression model.' },
  { icon: ScanSearch, title: 'Vehicle Analysis', text: 'Analyze important vehicle characteristics.' },
  { icon: Zap, title: 'Instant Results', text: 'Receive predictions without manually calculating prices.' },
  { icon: MousePointerClick, title: 'Simple Interface', text: 'No complicated spreadsheets or formulas.' },
  { icon: Database, title: 'Data-Driven', text: 'Predictions are generated using a trained machine learning model.' },
  { icon: MonitorSmartphone, title: 'Responsive', text: 'Works beautifully on desktop, tablet and mobile.' },
]

export function Features() {
  return (
    <section id="features" className="container-x pt-24">
      <SectionHeading eyebrow="Features" title="Everything you need for a fair estimate" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <li key={f.title}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <HoverCard className="h-full p-6">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <f.icon size={20} aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </HoverCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
