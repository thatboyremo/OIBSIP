import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ScrollToHash } from './components/ScrollToHash'
import { Skeleton } from './components/ui/skeleton'
import AboutPage from './pages/About'
import HistoryPage from './pages/History'
import HomePage from './pages/Home'
import NotFoundPage from './pages/NotFound'
import PredictPage from './pages/Predict'

const DashboardPage = lazy(() => import('./pages/Dashboard')) // keeps Recharts out of the initial bundle

export default function App() {
  const location = useLocation()
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <ScrollToHash />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          id="main"
          className="min-h-[70vh]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<div className="container-x space-y-4 py-16"><Skeleton className="h-10 w-64" /><Skeleton className="h-64 w-full" /></div>}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}
