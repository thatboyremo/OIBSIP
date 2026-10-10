import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Gauge, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PredictionResult } from '../components/PredictionResult'
import { PredictorForm } from '../components/PredictorForm'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { useHistory } from '../hooks/useHistory'
import { ApiError, getMetadata, predictPrice } from '../lib/api'
import type { CategoricalField, VehicleInput } from '../types'

type Options = Record<CategoricalField, string[]>
type Status = 'idle' | 'loading' | 'success' | 'error'
interface Result { price: number; input: VehicleInput; previous: number[] }

const GENERIC = 'Something went wrong. Please try again.'

export default function PredictPage() {
  const [options, setOptions] = useState<Options | null>(null)
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaError, setMetaError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { entries, add } = useHistory()
  const panelRef = useRef<HTMLDivElement>(null)

  const loadMeta = useCallback(async () => {
    setMetaLoading(true)
    setMetaError(null)
    try {
      const meta = await getMetadata()
      setOptions(meta.options)
    } catch (e) {
      setMetaError(e instanceof ApiError ? e.message : GENERIC)
    } finally {
      setMetaLoading(false)
    }
  }, [])

  useEffect(() => { void loadMeta() }, [loadMeta])

  const handlePredict = async (input: VehicleInput) => {
    setStatus('loading')
    setError(null)
    if (window.innerWidth < 1024) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    try {
      const res = await predictPrice(input)
      if (typeof res.predicted_price !== 'number' || !Number.isFinite(res.predicted_price)) throw new ApiError('unknown')
      const previous = entries.map((e) => e.predictedPrice)
      add(input, res.predicted_price)
      setResult({ price: res.predicted_price, input, previous })
      setStatus('success')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : GENERIC)
      setStatus('error')
    }
  }

  return (
    <div className="container-x py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Predict your car's value</h1>
      <p className="mb-8 mt-2 text-muted">Enter the vehicle's details to get an estimated selling price.</p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <Card className="p-5 sm:p-7">
          <h2 className="mb-5 text-lg font-semibold">Vehicle Information</h2>
          {metaLoading ? (
            <div className="grid gap-5 sm:grid-cols-2" role="status" aria-label="Loading form">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : metaError || !options ? (
            <div role="alert" className="flex flex-col items-start gap-4 rounded-lg border border-danger/40 bg-danger/5 p-4">
              <p className="flex gap-2 text-sm"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />{metaError ?? GENERIC}</p>
              <Button variant="secondary" size="sm" onClick={() => void loadMeta()}><RefreshCw size={14} aria-hidden="true" /> Try again</Button>
            </div>
          ) : (
            <PredictorForm options={options} loading={status === 'loading'} onSubmit={handlePredict} />
          )}
        </Card>

        <div ref={panelRef} className="scroll-mt-24 lg:sticky lg:top-24" aria-live="polite">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex flex-col items-center px-6 py-16 text-center">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent"><Gauge size={22} aria-hidden="true" /></span>
                  <h2 className="text-lg font-semibold">Prediction Result</h2>
                  <p className="mt-2 max-w-xs text-sm text-muted">Your estimated market value will appear here once you submit the vehicle details.</p>
                </Card>
              </motion.div>
            )}
            {status === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
                <Card className="p-6 sm:p-8">
                  <p className="text-sm font-medium">Analyzing vehicle...</p>
                  <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-surface2">
                    <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-accent to-accent2 [animation:indeterminate_1.2s_ease-in-out_infinite]" />
                  </div>
                  <Skeleton className="mt-8 h-12 w-3/4" />
                  <Skeleton className="mt-4 h-4 w-1/2" />
                  <div className="mt-8 grid grid-cols-3 gap-4">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10" />)}</div>
                </Card>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card role="alert" className="flex flex-col items-center border-danger/40 px-6 py-14 text-center">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger"><AlertTriangle size={22} aria-hidden="true" /></span>
                  <h2 className="text-lg font-semibold">Couldn't get a prediction</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
                </Card>
              </motion.div>
            )}
            {status === 'success' && result && (
              <motion.div key={`result-${entries.length}-${result.price}`} exit={{ opacity: 0 }}>
                <PredictionResult price={result.price} input={result.input} previousPrices={result.previous} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
