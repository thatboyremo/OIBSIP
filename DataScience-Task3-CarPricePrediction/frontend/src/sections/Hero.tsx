import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ButtonLink } from '../components/ui/button'
import { useCountUp } from '../hooks/useCountUp'
import { formatCurrency } from '../lib/format'

/** MARKETING DEMO DATA ONLY (values are already in naira). These vehicles/values are illustrative and are never produced by the ML model. */
const DEMOS = [
  { name: 'Toyota Corolla', sub: 'Petrol • Automatic', age: 5, km: 45000, cc: 1197, bhp: 82, value: 8450000 },
  { name: 'Hyundai Creta', sub: 'Diesel • Manual', age: 3, km: 28000, cc: 1493, bhp: 113, value: 16200000 },
  { name: 'BMW 3 Series', sub: 'Diesel • Automatic', age: 4, km: 36000, cc: 1995, bhp: 190, value: 38500000 },
]

const PARTICLES = [
  [8, 20, 4, 0], [18, 70, 3, 0.8], [30, 12, 3, 1.6], [44, 82, 4, 0.4], [58, 8, 3, 1.2], [70, 64, 5, 2],
  [82, 22, 3, 0.6], [92, 74, 4, 1.4], [14, 46, 3, 2.2], [52, 48, 2, 0.2], [76, 40, 3, 1.8], [38, 30, 2, 1],
] as const

function DemoCard() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % DEMOS.length), 5200)
    return () => window.clearInterval(t)
  }, [])
  const d = DEMOS[i]
  const value = useCountUp(d.value, true, 1400)

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-md"
    >
      <div className="glass rounded-2xl p-5 shadow-glow sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Vehicle analysis</span>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">Demo Preview</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <p className="text-xl font-semibold">{d.name}</p>
            <p className="text-sm text-muted">{d.sub}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ['Age', `${d.age} yrs`],
                ['Mileage', `${d.km.toLocaleString()} km`],
                ['Engine', `${d.cc.toLocaleString()} cc`],
                ['Power', `${d.bhp} bhp`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-surface2/60 px-3 py-2">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-xl border border-border bg-bg/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">AI price estimate</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-gradient">{formatCurrency(value)}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface2">
                <motion.div key={`bar-${i}`} className="h-full rounded-full bg-gradient-to-r from-accent to-accent2" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.4, ease: 'easeOut' }} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 text-[11px] text-muted">Illustrative values for demonstration, not a real model prediction.</p>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
  return (
    <section id="home" className="relative overflow-hidden">
      {/* backdrop: grid, drifting gradient blobs, floating particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl [animation:drift_14s_ease-in-out_infinite]" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-accent2/20 blur-3xl [animation:drift_18s_ease-in-out_infinite_reverse]" />
        {PARTICLES.map(([x, y, s, delay], k) => (
          <motion.span
            key={k}
            className="absolute rounded-full bg-accent/60"
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}
            animate={{ y: [0, -16, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 5 + (k % 4), repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="container-x relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
          <motion.p variants={item} className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted">
            <Sparkles size={14} className="text-accent" aria-hidden="true" /> Machine learning price estimates
          </motion.p>
          <motion.h1 variants={item} className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Know What Your Car <span className="text-gradient">Is Worth.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-base text-muted sm:text-lg">
            Get an AI-powered estimate of your used car's market value using real vehicle characteristics — in seconds.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/predict" size="lg">
              Predict My Car's Value <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to={{ pathname: '/', hash: '#how-it-works' }} variant="secondary" size="lg">
              See How It Works
            </ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.25 }} className="relative flex justify-center lg:justify-end">
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/40 to-accent2/40 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <DemoCard />
        </motion.div>
      </div>
    </section>
  )
}
