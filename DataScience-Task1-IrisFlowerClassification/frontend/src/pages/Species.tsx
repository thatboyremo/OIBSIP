import { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Title } from "../components/ui";
import { ROWS } from "../lib/dataset";
import { COLORS, FIELDS, SPECIES, type Species } from "../lib/species";
import { mean, std } from "../lib/stats";
import { AXIS, GRID, TIP } from "../lib/chart";

const INFO: Record<Species, { name: string; text: string }> = {
  setosa: { name: "Iris setosa", text: "A small iris of cold northern regions, including Alaska, northeastern Asia and Japan. In this dataset it has the smallest petals of the three species, and its petal measurements do not overlap with the other two." },
  versicolor: { name: "Iris versicolor", text: "Often called the blue flag, native to eastern North America where it grows in wet meadows and along shorelines. Its measurements sit between setosa and virginica and overlap with virginica." },
  virginica: { name: "Iris virginica", text: "The Virginia blueflag, native to eastern North America and found in wet meadows and marshes. In this dataset it has the largest petals on average, but some flowers overlap with versicolor." },
};
const stat = (s: Species, k: (typeof FIELDS)[number]["key"]) => { const v = ROWS.filter((r) => r.species === s).map((r) => r[k]); return { mean: mean(v), std: std(v), min: Math.min(...v), max: Math.max(...v) }; };

export default function SpeciesPage() {
  const [k, setK] = useState<(typeof FIELDS)[number]["key"]>("petal_length");
  const data = SPECIES.map((s) => ({ species: s, mean: +stat(s, k).mean.toFixed(2) }));
  return (<>
    <Title sub="Statistics on this page describe the 150 observations in the Iris dataset (50 per species). They are not predictions from the model.">Species Explorer</Title>
    <div className="mb-6 grid gap-4 lg:grid-cols-3">
      {SPECIES.map((s) => (
        <Card key={s}>
          <svg viewBox="0 0 80 40" className="mb-3 h-12 w-24" aria-hidden="true">{[-30, 0, 30].map((a) => <ellipse key={a} cx="40" cy="22" rx="8" ry="16" fill={COLORS[s]} opacity={a === 0 ? 0.95 : 0.6} transform={`rotate(${a} 40 34)`} />)}</svg>
          <h2 className="text-lg font-semibold" style={{ color: COLORS[s] }}>{INFO[s].name}</h2>
          <p className="mt-2 text-sm text-muted">{INFO[s].text}</p>
          <table className="mt-3 w-full text-xs"><caption className="mb-1 text-left text-muted">Dataset mean ± sample SD, min to max (cm)</caption><tbody>
            {FIELDS.map((f) => { const x = stat(s, f.key); return <tr key={f.key} className="border-t border-line"><th scope="row" className="py-1 text-left font-normal">{f.label}</th><td>{x.mean.toFixed(2)} ± {x.std.toFixed(2)}</td><td className="text-muted">{x.min.toFixed(1)} to {x.max.toFixed(1)}</td></tr>; })}</tbody></table>
          <p className="mt-2 text-xs text-muted">The min to max range shows what this sample contains, not a guaranteed range for the species.</p>
          <Link to={`/predict?example=${s}`} className="mt-3 inline-block rounded-lg border border-line px-3 py-1 text-sm">Try a real {s} example in the predictor</Link>
        </Card>))}
    </div>
    <Card title="Compare species by mean measurement (cm)">
      <div role="radiogroup" aria-label="Feature" className="mb-3 flex flex-wrap gap-2">
        {FIELDS.map((f) => <button key={f.key} role="radio" aria-checked={k === f.key} onClick={() => setK(f.key)} className={`rounded-lg border px-3 py-1 text-sm ${k === f.key ? "border-iris bg-iris/20" : "border-line"}`}>{f.label}</button>)}</div>
      <div className="h-64"><ResponsiveContainer><BarChart data={data}><CartesianGrid stroke={GRID} /><XAxis dataKey="species" stroke={AXIS} /><YAxis stroke={AXIS} /><Tooltip {...TIP} /><Legend />
        <Bar dataKey="mean" name={`Mean ${FIELDS.find((f) => f.key === k)!.label.toLowerCase()} (cm)`} fill="var(--color-iris)" /></BarChart></ResponsiveContainer></div>
    </Card>
  </>);
}
