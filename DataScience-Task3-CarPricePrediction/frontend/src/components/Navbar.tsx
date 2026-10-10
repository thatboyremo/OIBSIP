import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { buttonClass } from './ui/button'

const LINKS = [
  { label: 'Home', pathname: '/', hash: '' },
  { label: 'How It Works', pathname: '/', hash: '#how-it-works' },
  { label: 'Features', pathname: '/', hash: '#features' },
  { label: 'Predict', pathname: '/predict', hash: '' },
  { label: 'About', pathname: '/about', hash: '' },
]

export function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (l: (typeof LINKS)[number]) =>
    l.pathname === '/' ? location.pathname === '/' && location.hash === l.hash : location.pathname === l.pathname

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-border bg-bg/80 backdrop-blur-lg' : 'border-transparent bg-transparent',
      )}
    >
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = isActive(l)
            return (
              <li key={l.label}>
                <Link
                  to={{ pathname: l.pathname, hash: l.hash }}
                  aria-current={active ? 'page' : undefined}
                  className={cn('relative rounded-md px-3 py-2 text-sm transition-colors', active ? 'text-fg' : 'text-muted hover:text-fg')}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-md bg-surface2"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/predict" className={buttonClass('primary', 'md', 'hidden sm:inline-flex')}>
            <Sparkles size={16} aria-hidden="true" /> Try Predictor
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {LINKS.map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link
                    to={{ pathname: l.pathname, hash: l.hash }}
                    aria-current={isActive(l) ? 'page' : undefined}
                    className={cn('block rounded-lg px-3 py-3 text-base', isActive(l) ? 'bg-surface2 text-fg' : 'text-muted hover:bg-surface2 hover:text-fg')}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-2">
                <Link to="/predict" className={buttonClass('primary', 'lg', 'w-full')}>
                  <Sparkles size={18} aria-hidden="true" /> Try Predictor
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
