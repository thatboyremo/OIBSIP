import { CURRENCY, CURRENCY_LOCALE, PRICE_MULTIPLIER } from '../config'

const moneyFmt = new Intl.NumberFormat(CURRENCY_LOCALE, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 })
const numFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

/** Format an amount that is already in the display currency. */
export const formatCurrency = (n: number) => moneyFmt.format(Math.round(n))
/** Convert a raw model output to the display currency, then format it. */
export const toDisplay = (modelValue: number) => modelValue * PRICE_MULTIPLIER
export const formatMoney = (modelValue: number) => formatCurrency(toDisplay(modelValue))
export const formatNumber = (n: number) => numFmt.format(n)

const UPPER = new Set(['bmw', 'mg', 'cng', 'lpg'])
/** Display label for a backend category value (values stay lowercase on the wire). */
export function labelFor(value: string): string {
  if (UPPER.has(value)) return value.toUpperCase()
  return value.replace(/(^|[\s-])(\w)/g, (_, sep: string, ch: string) => sep + ch.toUpperCase())
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
export function timeAgo(iso: string, now = Date.now()): string {
  const diff = (new Date(iso).getTime() - now) / 1000
  const abs = Math.abs(diff)
  if (abs < 45) return 'just now'
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day')
  return new Date(iso).toLocaleDateString()
}
