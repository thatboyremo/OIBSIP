import { PredictionHistory } from '../components/PredictionHistory'
import { useHistory } from '../hooks/useHistory'

export default function HistoryPage() {
  const { entries, loaded, remove, clear } = useHistory()
  return (
    <div className="container-x py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Prediction History</h1>
      <p className="mb-8 mt-2 text-muted">Predictions you've made on this device.</p>
      <PredictionHistory entries={entries} loaded={loaded} onRemove={remove} onClear={clear} />
    </div>
  )
}
