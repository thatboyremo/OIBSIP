import Header from './components/Header'
import Hero from './components/Hero'
import SpamDetector from './components/SpamDetector'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Header />
      <main>
        <Hero />
        <SpamDetector />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
