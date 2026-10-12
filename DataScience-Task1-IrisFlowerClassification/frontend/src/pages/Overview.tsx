import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Stat, Title } from "../components/ui";
import Pipeline from "../components/Pipeline";
import { ROWS } from "../lib/dataset";
import { COLORS, SPECIES } from "../lib/species";
import { loadEvaluation, type Evaluation } from "../services/evaluation";
import { readHistory } from "../lib/history";
import type { Health } from "../services/api";

export default function Overview({ health }: { health: Health | "down" | null }) {
  const [ev, setEv] = useState<Evaluation | null | undefined>(undefined);
  useEffect(() => { loadEvaluation().then(setEv); }, []);
  const sel = ev?.models.find((m) => m.selected);
  const last = readHistory()[0];
  const means = ["sepal_length", "sepal_width", "petal_length", "petal_width"].map((k) => ({
    feature: k.replace("_", " "), ...Object.fromEntries(SPECIES.map((s) => { const r = ROWS.filter((x) => x.species === s); return [s, +(r.reduce((a, x) => a + (x as any)[k], 0) / r.length).toFixed(2)]; })) }));
  const apiText = health === null ? "Checking" : health === "down" ? "Unreachable" : health.status === "ok" ? "Ready" : "Degraded";
  return (<>
    <Title sub="Predict iris species, investigate the dataset, and explore model performance through an interactive machine learning workspace.">Explore the Iris Classification Model</Title>
    <div className="mb-8 flex flex-wrap gap-3">
      <Link to="/predict" className="rounded-lg bg-iris px-4 py-2 font-medium text-onaccent">Make a Prediction</Link>
      <Link to="/dataset" className="rounded-lg border border-line px-4 py-2">Explore the Dataset</Link>
    </div>
    <p className="mb-2 text-xs text-muted">Dataset facts (standard scikit-learn Iris dataset)</p>
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Samples" value={ROWS.length} /><Stat label="Input features" value={4} /><Stat label="Target classes" value={3} /><Stat label="Samples per class" value={50} />
    </div>
    <p className="mb-2 text-xs text-muted">Model and service</p>
    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Selected classifier" value={sel ? sel.name : "Not configured"} />
      <Stat label="Test accuracy" value={sel ? `${(sel.accuracy * 100).toFixed(1)}%` : "—"} note={sel ? `${ev!.test_samples} held-out samples from the notebook` : "Evaluation results not configured"} />
      <Stat label="Last prediction" value={last ? last.result.prediction : "None yet"} /><Stat label="API status" value={apiText} />
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Mean of each feature by species (cm)"><div className="h-72"><ResponsiveContainer><BarChart data={means}><CartesianGrid stroke="var(--color-line)" /><XAxis dataKey="feature" stroke="var(--color-muted)" /><YAxis stroke="var(--color-muted)" /><Tooltip contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-line)" }} /><Legend />
        {SPECIES.map((s) => <Bar key={s} dataKey={s} fill={COLORS[s]} />)}</BarChart></ResponsiveContainer></div></Card>
      <Card title="Petal length vs petal width (cm)"><div className="h-72"><ResponsiveContainer><ScatterChart><CartesianGrid stroke="var(--color-line)" /><XAxis type="number" dataKey="petal_length" name="Petal length" stroke="var(--color-muted)" /><YAxis type="number" dataKey="petal_width" name="Petal width" stroke="var(--color-muted)" /><Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "var(--color-panel)", border: "1px solid var(--color-line)" }} /><Legend />
        {SPECIES.map((s) => <Scatter key={s} name={s} data={ROWS.filter((r) => r.species === s)} fill={COLORS[s]} />)}</ScatterChart></ResponsiveContainer></div></Card>
    </div>
    <div className="mt-6"><Pipeline /></div>
  </>);
}
