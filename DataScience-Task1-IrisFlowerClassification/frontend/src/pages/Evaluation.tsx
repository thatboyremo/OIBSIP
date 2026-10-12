import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Stat, Title } from "../components/ui";
import { loadEvaluation, type Evaluation as Ev } from "../services/evaluation";
import { AXIS, GRID, TIP } from "../lib/chart";

const PROV: Record<string, string> = { saved_model: "Evaluated with the saved iris_model.pkl", refit_from_notebook_config: "Refit from the notebook configuration on the same training split (not a saved file)" };
export function EvaluationView({ ev }: { ev: Ev | null }) {
  if (!ev) return <Card><p>Evaluation results not configured</p><p className="mt-2 text-sm text-muted">Add a valid artifacts/evaluation.json (see artifacts/README.md) and copy it to frontend/public.</p></Card>;
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  return (<div className="space-y-6">
    <p className="max-w-3xl text-sm text-muted">Metrics are from the notebook's held-out test set ({ev.test_samples} samples, 20% stratified split). Training used {ev.train_samples} samples. Live predictions in the app do not contribute to these numbers.</p>
    {ev.verification && (<Card title="Reproduction checks"><ul className="space-y-1 text-sm">{ev.verification.map((c) => <li key={c.check}><span className={c.passed ? "text-emerald-500" : "text-pink-400"}>{c.passed ? "Passed" : "Failed"}</span> {c.check}</li>)}</ul></Card>)}
    <Card title="Test accuracy by model"><div className="h-52"><ResponsiveContainer><BarChart data={ev.models.map((m) => ({ name: m.name, accuracy: +(m.accuracy * 100).toFixed(1) }))}><CartesianGrid stroke={GRID} /><XAxis dataKey="name" stroke={AXIS} /><YAxis domain={[0, 100]} unit="%" stroke={AXIS} /><Tooltip {...TIP} /><Bar dataKey="accuracy" fill="var(--color-iris)" /></BarChart></ResponsiveContainer></div></Card>
    {ev.models.map((m) => (<Card key={m.name} title={`${m.name}${m.selected ? " (the saved model)" : ""}`}>
      {m.provenance && <p className="mb-3 text-xs text-muted">{PROV[m.provenance] ?? m.provenance}</p>}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Accuracy" value={pct(m.accuracy)} /><Stat label="Macro precision" value={pct(m.macro.precision)} /><Stat label="Macro recall" value={pct(m.macro.recall)} /><Stat label="Macro F1" value={pct(m.macro["f1-score"])} /></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-x-auto"><table className="w-full text-sm"><caption className="mb-2 text-left text-xs text-muted">Per-class results</caption><thead className="text-left text-muted"><tr><th>Class</th><th>Precision</th><th>Recall</th><th>F1</th><th>Support</th></tr></thead>
          <tbody>{ev.labels.map((l) => <tr key={l} className="border-t border-line"><td className="py-1 capitalize">{l}</td><td>{m.per_class[l].precision.toFixed(2)}</td><td>{m.per_class[l].recall.toFixed(2)}</td><td>{m.per_class[l]["f1-score"].toFixed(2)}</td><td>{m.per_class[l].support}</td></tr>)}</tbody></table></div>
        <div className="overflow-x-auto"><table className="text-center text-sm"><caption className="mb-2 text-left text-xs text-muted">Confusion matrix (rows actual, columns predicted)</caption><thead><tr><th />{ev.labels.map((l) => <th key={l} className="px-3 capitalize text-muted">{l}</th>)}</tr></thead>
          <tbody>{m.confusion_matrix.map((row, i) => <tr key={i}><th className="pr-3 text-left capitalize text-muted">{ev.labels[i]}</th>{row.map((c, j) => <td key={j} className="h-12 w-20 border border-line" style={{ background: `rgba(139,124,246,${(0.08 + 0.7 * c / Math.max(...row, 1)).toFixed(2)})` }}>{c}</td>)}</tr>)}</tbody></table></div>
      </div></Card>))}
  </div>);
}
export default function Evaluation() {
  const [ev, setEv] = useState<Ev | null | undefined>(undefined);
  useEffect(() => { loadEvaluation().then(setEv); }, []);
  return (<><Title sub="Reproducible results from the original Jupyter notebook split.">Model Evaluation</Title>{ev === undefined ? <p role="status" className="text-muted">Loading evaluation…</p> : <EvaluationView ev={ev} />}</>);
}
