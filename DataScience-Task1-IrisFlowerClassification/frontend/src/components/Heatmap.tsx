import { useState } from "react";
import { Card } from "./ui";
import { ROWS } from "../lib/dataset";
import { FIELDS } from "../lib/species";
import { correlationMatrix } from "../lib/stats";

const cols = FIELDS.map((f) => ROWS.map((r) => r[f.key]));
export const CORR = correlationMatrix(cols); // computed from the real dataset at load time
// Diverging scale: cyan (negative) -> neutral -> violet (positive)
const color = (v: number) => (v >= 0 ? `rgba(139,124,246,${(0.12 + 0.78 * v).toFixed(2)})` : `rgba(56,189,248,${(0.12 + 0.78 * -v).toFixed(2)})`);
const word = (v: number) => { const a = Math.abs(v); const s = a >= 0.8 ? "strong" : a >= 0.5 ? "moderate" : "weak"; return `${s} ${v >= 0 ? "positive" : "negative"}`; };

export default function Heatmap() {
  const [hover, setHover] = useState<[number, number]>([2, 3]);
  const [i, j] = hover;
  return (
    <Card title="Feature correlation (Pearson r, all 150 observations)">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div role="grid" aria-label="Pearson correlation heatmap" className="grid w-fit grid-cols-[auto_repeat(4,4.5rem)] gap-1 text-xs sm:grid-cols-[auto_repeat(4,5.5rem)]">
          <div />{FIELDS.map((f) => <div key={f.key} className="px-1 text-center text-muted">{f.label}</div>)}
          {CORR.map((row, a) => (<div key={a} role="row" className="contents">
            <div className="flex items-center pr-2 text-muted">{FIELDS[a].label}</div>
            {row.map((v, b) => (
              <div key={b} role="gridcell" tabIndex={0} aria-label={`${FIELDS[a].label} and ${FIELDS[b].label}: correlation ${v.toFixed(2)}`} title={`${FIELDS[a].label} vs ${FIELDS[b].label}: r = ${v.toFixed(3)}`}
                onMouseEnter={() => setHover([a, b])} onFocus={() => setHover([a, b])}
                className="flex h-16 items-center justify-center rounded-md border border-line text-sm font-medium" style={{ background: color(v) }}>{v.toFixed(2)}</div>))}
          </div>))}
        </div>
        <div className="space-y-4 text-sm">
          <div><div className="text-xs text-muted">Selected pair</div><div className="font-medium">{FIELDS[i].label} and {FIELDS[j].label}</div>
            <div className="text-2xl font-semibold">r = {CORR[i][j].toFixed(3)}</div><div className="text-muted">{i === j ? "A feature always correlates perfectly with itself." : `A ${word(CORR[i][j])} linear relationship in this dataset.`}</div></div>
          <div><div className="mb-1 text-xs text-muted">Colour scale</div><div className="h-3 w-full max-w-xs rounded" style={{ background: "linear-gradient(90deg, rgba(56,189,248,.9), rgba(128,128,160,.15), rgba(139,124,246,.9))" }} />
            <div className="flex max-w-xs justify-between text-xs text-muted"><span>-1</span><span>0</span><span>+1</span></div></div>
          <p className="text-muted">Correlation describes linear association across all three species pooled together. It is not feature importance for the classifier and says nothing about cause.</p>
        </div>
      </div>
    </Card>
  );
}
