import { Reveal, SectionHeading } from '../components/Reveal'
import { Card } from '../components/ui/card'

const FEATURES = ['Brand', 'Vehicle age', 'Kilometers driven', 'Seller type', 'Fuel type', 'Transmission', 'Mileage', 'Engine', 'Maximum power', 'Seats']

export function AboutModel() {
  return (
    <section id="about-model" className="container-x pt-16">
      <SectionHeading eyebrow="The model" title="Built With Machine Learning" />
      <Reveal>
        <Card className="mx-auto max-w-3xl p-6 sm:p-8">
          <p className="text-muted">
            AutoValue AI uses a regression model trained on used-car data. The saved model is a scikit-learn pipeline: categorical
            features are one-hot encoded, then passed with the numeric features to a Random Forest regressor, an ensemble of 200 decision trees,
            which predicts the selling price. It returns a single estimated price.
          </p>
          <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider">Input features</h3>
          <ul className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <li key={f} className="rounded-full border border-border bg-surface2 px-3 py-1 text-sm">{f}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Estimates reflect patterns in the training data and are not guaranteed market valuations.
          </p>
        </Card>
      </Reveal>
    </section>
  )
}
