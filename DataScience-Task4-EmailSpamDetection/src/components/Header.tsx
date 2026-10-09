import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/90 backdrop-blur-md border-b border-navy-700/50 shadow-lg shadow-navy-950/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-accent-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="text-lg font-bold text-white tracking-tight">
              SpamGuard<span className="text-accent-500">AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy-200">
            <a href="#detector" className="hover:text-accent-400 transition-colors">
              Detector
            </a>
            <a href="#how-it-works" className="hover:text-accent-400 transition-colors">
              How It Works
            </a>
            <a
              href="#detector"
              className="px-4 py-2 rounded-lg bg-accent-500 text-navy-950 font-semibold hover:bg-accent-400 transition-all hover:shadow-lg hover:shadow-accent-500/30"
            >
              Try It Now
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
