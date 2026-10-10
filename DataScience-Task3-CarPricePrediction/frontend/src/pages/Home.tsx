import { ModelArchitecture } from '../components/ModelArchitecture'
import { CallToAction } from '../sections/CallToAction'
import { Features } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'
import { Stats } from '../sections/Stats'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <ModelArchitecture />
      <CallToAction />
    </>
  )
}
