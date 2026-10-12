import { useMemo, useState } from "react";
import { CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { Card, Title } from "../components/ui";
import Heatmap from "../components/Heatmap";
import { ROWS } from "../lib/dataset";
import { COLORS, FIELDS, SPECIES, type Species } from "../lib/species";

const PAGE = 10;
const tip = { contentStyle: { background: "var(--color-panel)", border: "1px solid var(--color-line)" } };
function hist(rows: typeof ROWS, key: string, species: Species[]) {
  const vals = ROWS.map((r) => (r as any)[key] as number); const lo = Math.floor(Math.min(...vals) * 2) / 2; const hi = Math.ceil(Math.max(...vals) * 2) / 2;
  const bins = Array.from({ length: Math.round((hi - lo) / 0.5) }, (_, i) => ({ bin: (lo + i * 0.5).toFixed(1), ...Object.fromEntries(species.map((s) => [s, 0])) } as any));
  rows.forEach((r) => { const i = Math.min(bins.length - 1, Math.floor(((r as any)[key] - lo) / 0.5)); bins[i][r.species]++; });
  return bins;
}
export default function Dataset() {
  const [sel, setSel] = useState<Species[]>([...SPECIES]); const [q, setQ] = useState(""); const [page, setPage] = useState(0);
  const rows = useMemo(() => ROWS.filter((r) => sel.includes(r.species)), [sel]);
  const table = useMemo(() => rows.filter((r) => `${r.id} ${r.species} ${r.sepal_length} ${r.sepal_width} ${r.petal_length} ${r.petal_width}`.includes(q.toLowerCase())), [rows, q]);
  const pages = Math.max(1, Math.ceil(table.length / PAGE)); const p = Math.min(page, pages - 1);
  const toggle = (s: Species) => { setSel(sel.includes(s) ? sel.filter((x) => x !== s) : [...sel, s]); setPage(0); };
  return (<>
    <Title sub="150 observations, 4 numeric features, 3 species with 50 samples each, and no missing values.">Dataset Explorer</Title>
    <fieldset className="mb-6 flex flex-wrap gap-4"><legend className="mb-2 text-xs text-muted">Species filter (updates every chart and the table)</legend>
      {SPECIES.map((s) => <label key={s} className="flex items-center gap-2 text-sm capitalize"><input type="checkbox" checked={sel.includes(s)} onChange={() => toggle(s)} />
        <span className="h-3 w-3 rounded-full" style={{ background: COLORS[s] }} />{s}</label>)}</fieldset>
    {sel.length === 0 ? <Card><p className="text-muted">Select at least one species to see charts and data.</p></Card> : (<>
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      {FIELDS.map((f) => <Card key={f.key} title={`${f.label} distribution (count per 0.5 cm bin)`}><div className="h-56"><ResponsiveContainer><BarChart data={hist(rows, f.key, sel)}><CartesianGrid stroke="var(--color-line)" /><XAxis dataKey="bin" stroke="var(--color-muted)" /><YAxis allowDecimals={false} stroke="var(--color-muted)" /><Tooltip {...tip} /><Legend />
        {sel.map((s) => <Bar key={s} dataKey={s} stackId="a" fill={COLORS[s]} />)}</BarChart></ResponsiveContainer></div></Card>)}
      {[["petal_length", "petal_width", "Petal length vs petal width"], ["sepal_length", "sepal_width", "Sepal length vs sepal width"]].map(([x, y, t]) => (
        <Card key={t} title={`${t} (cm)`}><div className="h-64"><ResponsiveContainer><ScatterChart><CartesianGrid stroke="var(--color-line)" /><XAxis type="number" dataKey={x} name={x.replace("_", " ")} domain={["auto", "auto"]} stroke="var(--color-muted)" /><YAxis type="number" dataKey={y} name={y.replace("_", " ")} domain={["auto", "auto"]} stroke="var(--color-muted)" /><Tooltip {...tip} /><Legend />
          {sel.map((s) => <Scatter key={s} name={s} data={rows.filter((r) => r.species === s)} fill={COLORS[s]} />)}</ScatterChart></ResponsiveContainer></div></Card>))}
    </div>
    <div className="mb-6"><Heatmap /></div>
    <Card title="What separates the species?"><p className="max-w-3xl text-sm text-muted">In the charts above, the petal measurements form clearly separated groups, while sepal width overlaps heavily between versicolor and virginica. That is why petal length and width tend to be more informative for telling species apart. This is a visual observation about the data, not a measure of the trained model's feature importance, and it does not imply causation.</p></Card>
    <div className="mt-6"><Card title="Observations">
      <input aria-label="Search observations" placeholder="Search by species or value" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="mb-3 w-full max-w-xs rounded-lg border border-line bg-ink px-3 py-2 text-sm" />
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-muted"><tr><th className="py-2">#</th>{FIELDS.map((f) => <th key={f.key}>{f.label}</th>)}<th>Species</th></tr></thead>
        <tbody>{table.slice(p * PAGE, p * PAGE + PAGE).map((r) => <tr key={r.id} className="border-t border-line"><td className="py-2">{r.id}</td>{FIELDS.map((f) => <td key={f.key}>{r[f.key]}</td>)}<td className="capitalize" style={{ color: COLORS[r.species] }}>{r.species}</td></tr>)}</tbody></table></div>
      {table.length === 0 && <p className="py-4 text-muted">No observations match this search.</p>}
      <div className="mt-3 flex items-center gap-3 text-sm"><button disabled={p === 0} onClick={() => setPage(p - 1)} className="rounded border border-line px-3 py-1 disabled:opacity-40">Previous</button>
        <span className="text-muted">Page {p + 1} of {pages}</span><button disabled={p >= pages - 1} onClick={() => setPage(p + 1)} className="rounded border border-line px-3 py-1 disabled:opacity-40">Next</button></div>
    </Card></div></>)}
  </>);
}
