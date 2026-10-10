export const API_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
export const GITHUB_URL: string = import.meta.env.VITE_GITHUB_URL ?? ''

/** Currency shown to users. Prices are shown in naira by default. */
export const CURRENCY: string = import.meta.env.VITE_CURRENCY ?? 'NGN'
export const CURRENCY_LOCALE: string = CURRENCY === 'INR' ? 'en-IN' : CURRENCY === 'NGN' ? 'en-NG' : 'en-US'

/**
 * The model's output is in the currency of its training data (the magnitudes indicate Indian rupees).
 * PRICE_MULTIPLIER converts model output into the display currency: naira per 1 rupee.
 * Exchange rates move: update VITE_PRICE_MULTIPLIER periodically (set it to 1 to show raw model output).
 */
const parsed = Number(import.meta.env.VITE_PRICE_MULTIPLIER)
export const PRICE_MULTIPLIER: number = Number.isFinite(parsed) && parsed > 0 ? parsed : 13.8
export const MODEL_CURRENCY = 'INR'
