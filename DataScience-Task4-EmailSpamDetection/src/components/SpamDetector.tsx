import { useState, useRef, useEffect } from 'react'
import { detectSpam } from '../api'
import type { PredictionResponse } from '../types'

const MAX_CHARS = 1000
const MIN_CHARS = 5

type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: PredictionResponse }
  | { status: 'error'; message: string }

export default function SpamDetector() {
  const [message, setMessage] = useState('')
  const [model, setModel] = useState<'naive_bayes' | 'logistic_regression'>('naive_bayes')
  const [result, setResult] = useState<ResultState>({ status: 'idle' })
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/health`)
      .then((r) => {
        if (!cancelled) setBackendAvailable(r.ok)
      })
      .catch(() => {
        if (!cancelled) setBackendAvailable(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const charCount = message.length
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleDetect = async () => {
    if (!isValid || result.status === 'loading') return
    setResult({ status: 'loading' })
    try {
      const data = await detectSpam(message, model)
      setResult({ status: 'success', data })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setResult({ status: 'error', message: msg })
    }
  }

  const handleClear = () => {
    setMessage('')
    setResult({ status: 'idle' })
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleDetect()
    }
  }

  const confidencePercent =
    result.status === 'success'
      ? Math.round(result.data.confidence * 100)
      : 0

  return (
    <section id="detector" className="relative py-20 bg-navy-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Message Detector
          </h2>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto">
            Paste or type any message below. Our machine learning model will analyze it and tell you
            whether it looks like spam.
          </p>
        </div>

        {/* Detector card */}
        <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-navy-950/50">
          {/* Model selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy-200 mb-3">
              Detection Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: 'naive_bayes', label: 'Naive Bayes', desc: 'Probabilistic classifier' },
                  {
                    id: 'logistic_regression',
                    label: 'Logistic Regression',
                    desc: 'Linear classifier',
                  },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    model === m.id
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-navy-700 bg-navy-800/30 hover:border-navy-600'
                  }`}
                >
                  <div
                    className={`font-semibold text-sm ${
                      model === m.id ? 'text-accent-300' : 'text-navy-100'
                    }`}
                  >
                    {m.label}
                  </div>
                  <div className="text-xs text-navy-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
            <input type="hidden" value={model} />
          </div>

          {/* Message input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-200 mb-3">
              Your Message
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value.slice(0, MAX_CHARS))
                  if (result.status !== 'idle') setResult({ status: 'idle' })
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter a message to analyze... e.g. 'CONGRATULATIONS! You've won a $1,000 gift card. Click here to claim your prize!'"
                className="w-full h-36 px-4 py-3 rounded-xl bg-navy-900/80 border border-navy-700 text-navy-50 placeholder-navy-500 resize-none focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all text-base leading-relaxed"
              />
            </div>
            {/* Character counter */}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${charCount > 0 && charCount < MIN_CHARS ? 'text-danger-400' : 'text-navy-400'}`}>
                {charCount < MIN_CHARS
                  ? `At least ${MIN_CHARS - charCount} more characters needed`
                  : ''}
              </span>
              <span
                className={`text-xs font-mono ${
                  charCount > MAX_CHARS * 0.9 ? 'text-danger-400' : 'text-navy-400'
                }`}
              >
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDetect}
              disabled={!isValid || result.status === 'loading' || backendAvailable === false}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent-500 text-navy-950 font-bold text-lg hover:bg-accent-400 transition-all hover:shadow-xl hover:shadow-accent-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {result.status === 'loading' ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin-slow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Detect Spam
                </>
              )}
            </button>
            {message && (
              <button
                onClick={handleClear}
                disabled={result.status === 'loading'}
                className="px-6 py-4 rounded-xl border border-navy-600 text-navy-200 font-semibold hover:border-danger-500/50 hover:text-danger-400 transition-all disabled:opacity-40"
              >
                Clear
              </button>
            )}
          </div>

          {/* Backend unavailable notice */}
          {backendAvailable === false && (
            <div className="mt-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/30 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-medium text-danger-300">
                  Backend server is not reachable
                </p>
                <p className="text-xs text-danger-200/70 mt-1">
                  Predictions are temporarily unavailable. Please make sure the FastAPI backend is
                  running and the <code className="text-accent-300">VITE_API_URL</code> environment
                  variable is set correctly.
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {result.status === 'success' && (
            <div className="mt-6 animate-slide-up">
              <div
                className={`p-6 rounded-2xl border-2 ${
                  result.data.is_spam
                    ? 'border-danger-500/50 bg-danger-500/10'
                    : 'border-accent-500/50 bg-accent-500/10'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      result.data.is_spam
                        ? 'bg-danger-500/20'
                        : 'bg-accent-500/20'
                    }`}
                  >
                    {result.data.is_spam ? (
                      <svg
                        className="w-8 h-8 text-danger-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 text-accent-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-2xl font-bold ${
                        result.data.is_spam ? 'text-danger-300' : 'text-accent-300'
                      }`}
                    >
                      {result.data.is_spam ? 'SPAM' : 'NOT SPAM'}
                    </div>
                    <div className="text-sm text-navy-300 mt-0.5">
                      Classified as: <span className="font-medium text-navy-100">{result.data.label}</span>
                    </div>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-navy-200">Confidence</span>
                    <span
                      className={`text-sm font-mono font-bold ${
                        result.data.is_spam ? 'text-danger-300' : 'text-accent-300'
                      }`}
                    >
                      {confidencePercent}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-navy-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        result.data.is_spam
                          ? 'bg-gradient-to-r from-danger-600 to-danger-400'
                          : 'bg-gradient-to-r from-accent-600 to-accent-400'
                      }`}
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>

                {/* Probability breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-navy-900/50 border border-navy-700/30">
                    <div className="text-xs text-navy-400 mb-1">Not Spam</div>
                    <div className="text-lg font-bold text-accent-300 font-mono">
                      {(result.data.probabilities.ham * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-900/50 border border-navy-700/30">
                    <div className="text-xs text-navy-400 mb-1">Spam</div>
                    <div className="text-lg font-bold text-danger-300 font-mono">
                      {(result.data.probabilities.spam * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {result.status === 'error' && (
            <div className="mt-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/30 animate-slide-up">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-danger-300">Prediction Failed</p>
                  <p className="text-sm text-danger-200/70 mt-1">{result.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          <p className="text-xs text-navy-500 mt-4 text-center">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-navy-700 text-navy-200 font-mono text-[10px]">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-navy-700 text-navy-200 font-mono text-[10px]">Enter</kbd> to analyze
          </p>
        </div>

        {/* Note about model selection: We need to pass the model to the API */}
        <p className="text-xs text-navy-500 mt-4 text-center max-w-2xl mx-auto">
          The selected model is sent to the backend. Make sure your API supports a{' '}
          <code className="text-navy-300">model</code> field in the request body.
        </p>
      </div>
    </section>
  )
}
