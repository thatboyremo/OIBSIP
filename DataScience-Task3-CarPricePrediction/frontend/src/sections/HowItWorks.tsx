import { BadgeDollarSign, ClipboardList, Cpu } from 'lucide-react'
import { Reveal, SectionHeading } from '../components/Reveal'
import { HoverCard } from '../components/ui/card'

const STEPS = [
  { n: '01', icon: ClipboardList, title: 'Enter Vehicle Details', text: 'Provide the characteristics of the vehicle.' },
  { n: '02', icon: Cpu, title: 'AI Analyzes the Vehicle', text: 'The trained machine learning model processes the information.' },
  { n: '03', icon: BadgeDollarSign, title: 'Get Your Estimated Value', text: 'Receive a predicted selling price instantly.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-x pt-24">
      <SectionHeading eyebrow="How it works" title="From vehicle details to a price in three steps" />
      <ol className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.n}>
            <Reveal delay={i * 0.12} className="h-full">
              <HoverCard className="h-full p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <s.icon size={22} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm text-muted">Step {s.n}</span>
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </HoverCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
