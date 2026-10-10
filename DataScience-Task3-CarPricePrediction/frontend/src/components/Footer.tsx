import { Link } from 'react-router-dom'
import { GITHUB_URL } from '../config'
import { Logo } from './Logo'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Predictor', to: '/predict' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'History', to: '/history' },
  { label: 'About', to: '/about' },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-x flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">AI-powered used car price prediction.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted transition-colors hover:text-fg">{l.label}</Link>
              </li>
            ))}
            <li>
              {GITHUB_URL ? (
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-fg">GitHub</a>
              ) : (
                <span className="cursor-not-allowed text-muted/60" aria-disabled="true" title="Set VITE_GITHUB_URL to enable this link">GitHub</span>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} AutoValue AI. Estimates are model predictions, not guaranteed market valuations.
      </div>
    </footer>
  )
}
