import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Animates 0 -> target. Jumps straight to target when the user prefers reduced motion. */
export function useCountUp(target: number, enabled = true, duration = 1200) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) return
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, enabled, reduce, duration])

  return value
}
