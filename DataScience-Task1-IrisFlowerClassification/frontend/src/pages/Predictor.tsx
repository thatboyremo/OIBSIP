import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, RotateCcw } from "lucide-react";
import { Card, Title } from "../components/ui";
import { COLORS, FIELDS, SPECIES, type Measurements, type Species } from "../lib/species";
import { EXAMPLES } from "../lib/dataset";
import { predict, type Prediction } from "../services/api";
import { addHistory } from "../lib/history";

const RANGE: Record<string, [number, number]> = { sepal_length: [0.1, 15], sepal_width: [0.1, 10], petal_length: [0.1, 15], petal_width: [0.01, 10] };
const EMPTY = { sepal_length: "", sepal_width: "", petal_length: "", petal_width: "" } as Record<string, string>;

export function validate(v: Record<string, string>): Record<string, string> {
  const e: Record<string, string> = {};
  for (const f of FIELDS) {
    const raw = v[f.key].trim(); const n = Number(raw); const [lo, hi] = RANGE[f.key];
    if (raw === "") e[f.key] = "Enter a value."; else if (!Number.isFinite(n)) e[f.key] = "Must be a number.";
    else if (n < lo || n > hi) e[f.key] = `Must be between ${lo} and ${hi} cm.`;
  }
  return e;
}

export default function Predictor() {
  const [v, setV] = useState(EMPTY); const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false); const [apiErr, setApiErr] = useState<string | null>(null);
  const [res, setRes] = useState<{ input: Measurements; out: Prediction } | null>(null);

  async function run() {
    const e = validate(v); setErrs(e); if (Object.keys(e).length) return;
    const input = Object.fromEntries(FIELDS.map((f) => [f.key, Number(v[f.key])])) as Measurements;
    setBusy(true); setApiErr(null);
    try { const out = await predict(input); setRes({ input, out }); addHistory({ at: new Date().toISOString(), input, result: out }); }
    catch (x) { setApiErr((x as Error).message); setRes(null); } finally { setBusy(false); }
  }
  const load = (i: number) => { const r = EXAMPLES[i]; setV(Object.fromEntries(FIELDS.map((f) => [f.key, String(r[f.key])]))); setErrs({}); };

  const [params] = useSearchParams();
  useEffect(() => { const i = SPECIES.indexOf(params.get("example") as Species); if (i >= 0) load(i); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    <Title sub="Enter four measurements in centimetres. Your values are sent to the FastAPI backend, which applies the saved scaler and classifier.">Live Predictor</Title>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Measurements">
        <form noValidate onSubmit={(e) => { e.preventDefault(); run(); }} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}><label htmlFor={f.key} className="mb-1 block text-sm">{f.label} (cm)</label>
              <input id={f.key} inputMode="decimal" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
                aria-invalid={!!errs[f.key]} aria-describedby={errs[f.key] ? `${f.key}-e` : undefined}
                className="w-full rounded-lg border border-line bg-ink px-3 py-2" />
              {errs[f.key] && <p id={`${f.key}-e`} className="mt-1 text-sm text-pink-400">{errs[f.key]}</p>}</div>))}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="flex items-center gap-2 rounded-lg bg-iris px-4 py-2 font-medium text-onaccent disabled:opacity-60">{busy && <Loader2 className="animate-spin" size={16} />}Predict species</button>
            <button type="button" onClick={() => { setV(EMPTY); setErrs({}); setRes(null); setApiErr(null); }} className="flex items-center gap-2 rounded-lg border border-line px-4 py-2"><RotateCcw size={14} />Reset inputs</button>
          </div>
          <div><p className="mb-2 text-xs text-muted">Load an example (real observations from the dataset)</p>
            <div className="flex flex-wrap gap-2">{EXAMPLES.map((r, i) => <button type="button" key={r.id} onClick={() => load(i)} className="rounded-lg border border-line px-3 py-1 text-sm capitalize" style={{ borderColor: COLORS[r.species] }}>{r.species}</button>)}</div></div>
        </form>
      </Card>
      <Card title="Result">
        {busy && <p role="status" className="text-muted">Running the model…</p>}
        {apiErr && !busy && <div role="alert" className="space-y-3"><p className="text-pink-400">{apiErr}</p><button onClick={run} className="rounded-lg border border-line px-3 py-1 text-sm">Retry</button></div>}
        {!busy && !apiErr && !res && <p className="text-muted">Enter measurements or load an example, then choose Predict species.</p>}
        {res && !busy && (<div className="space-y-4">
          <div><div className="text-xs text-muted">Predicted species</div><div className="text-3xl font-semibold capitalize" style={{ color: COLORS[res.out.prediction as Species] }}>Iris {res.out.prediction}</div></div>
          {res.out.probabilities ? (<div><div className="mb-2 text-xs text-muted">Model probability estimates (not guaranteed certainty)</div>
            {Object.entries(res.out.probabilities).map(([k, p]) => (<div key={k} className="mb-2"><div className="flex justify-between text-sm capitalize"><span>{k}</span><span>{(p * 100).toFixed(2)}%</span></div>
              <div className="h-2 rounded bg-ink"><div className="h-2 rounded transition-[width]" style={{ width: `${p * 100}%`, background: COLORS[k as Species] }} /></div></div>))}</div>)
            : <p className="text-sm text-muted">This classifier does not provide probabilities.</p>}
          <details className="text-sm"><summary className="cursor-pointer text-muted">Raw API response</summary><pre className="mt-2 overflow-x-auto rounded-lg bg-ink p-3 text-xs">{JSON.stringify(res.out, null, 2)}</pre></details>
          <Link to="/history" className="text-sm text-iris underline">View prediction history</Link>
        </div>)}
      </Card>
    </div>
  </>);
}
