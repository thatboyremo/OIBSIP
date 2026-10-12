import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "./ui";

// Mirrors backend/app: schemas/iris.py (validation), services/model_service.py (scaler + classifier).
const STEPS = [
  { t: "Input measurements", d: "Four numbers in centimetres: sepal length, sepal width, petal length, petal width, sent as JSON to POST /api/v1/predict." },
  { t: "Input validation", d: "Pydantic accepts only numbers that are finite and inside sensible ranges, and rejects missing or extra fields before the model runs." },
  { t: "StandardScaler", d: "The values are placed in the training feature order and scaled with the mean and standard deviation saved in iris_scaler.pkl." },
  { t: "Logistic Regression", d: "The saved classifier in iris_model.pkl predicts the class and, through predict_proba, a probability for each of the three species." },
  { t: "Predicted species and probabilities", d: "The API returns the species name, its class index and the three probabilities. They are model estimates, not guaranteed certainty." },
];
export default function Pipeline() {
  const reduce = useReducedMotion(); const [run, setRun] = useState(0);
  return (
    <Card title="How a prediction is made">
      <ol key={run} className="grid gap-3 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <motion.li key={s.t} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : i * 0.3, duration: 0.4 }}
            className="rounded-lg border border-line p-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-iris text-xs text-onaccent">{i + 1}</span>{s.t}</div>
            <p className="text-xs text-muted">{s.d}</p>
          </motion.li>))}
      </ol>
      <button onClick={() => setRun(run + 1)} className="mt-3 rounded-lg border border-line px-3 py-1 text-sm">Replay animation</button>
    </Card>
  );
}
