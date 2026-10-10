import { ArrowRight } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { ButtonLink } from '../components/ui/button'

export function CallToAction() {
  return (
    <section className="container-x pt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 text-center sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent2/10" />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">Ready to see what your car is worth?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-muted">Enter your vehicle's details and get an estimate in seconds.</p>
          <div className="relative mt-8">
            <ButtonLink to="/predict" size="lg">
              Predict My Car's Value <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
