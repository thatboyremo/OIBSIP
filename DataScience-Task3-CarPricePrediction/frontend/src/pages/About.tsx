import { AboutModel } from '../sections/AboutModel'
import { ModelPerformance } from '../sections/ModelPerformance'

export default function AboutPage() {
  return (
    <div className="pt-12">
      <AboutModel />
      <ModelPerformance />
    </div>
  )
}
