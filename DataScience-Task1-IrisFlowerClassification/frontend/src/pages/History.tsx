import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Title } from "../components/ui";
import { clearHistory, readHistory } from "../lib/history";
import { COLORS, type Species } from "../lib/species";

export default function HistoryPage() {
  const [items, setItems] = useState(readHistory());
  return (<>
    <Title sub="Stored only in this browser tab (session storage). It is not a server-side database.">Prediction History</Title>
    {items.length === 0 ? (<Card><p className="mb-3 text-muted">No predictions yet in this session.</p><Link to="/predict" className="inline-block rounded-lg bg-iris px-4 py-2 font-medium text-onaccent">Make your first prediction</Link></Card>) : (<>
      <button onClick={() => { clearHistory(); setItems([]); }} className="mb-4 rounded-lg border border-line px-3 py-1 text-sm">Clear history</button>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-muted"><tr><th>Time</th><th>SL</th><th>SW</th><th>PL</th><th>PW</th><th>Prediction</th><th>Probabilities</th></tr></thead>
        <tbody>{items.map((h) => <tr key={h.at} className="border-t border-line"><td className="py-2">{new Date(h.at).toLocaleTimeString()}</td><td>{h.input.sepal_length}</td><td>{h.input.sepal_width}</td><td>{h.input.petal_length}</td><td>{h.input.petal_width}</td>
          <td className="capitalize" style={{ color: COLORS[h.result.prediction as Species] }}>{h.result.prediction}</td><td className="text-muted">{h.result.probabilities ? Object.entries(h.result.probabilities).map(([k, p]) => `${k.slice(0, 3)} ${(p * 100).toFixed(1)}%`).join(" · ") : "n/a"}</td></tr>)}</tbody></table></div></>)}
  </>);
}
