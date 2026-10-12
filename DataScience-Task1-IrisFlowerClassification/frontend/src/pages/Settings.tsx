import { useEffect, useState } from "react";
import { Card, Title } from "../components/ui";
import { useTheme, type Theme } from "../lib/theme";
import { clearHistory, readHistory } from "../lib/history";
import { API_URL, getHealth, type Health } from "../services/api";

export default function Settings() {
  const { theme, setTheme } = useTheme(); const [n, setN] = useState(readHistory().length);
  const [h, setH] = useState<Health | "down" | null>(null);
  const check = () => { setH(null); getHealth().then(setH).catch(() => setH("down")); };
  useEffect(check, []);
  return (<>
    <Title sub="Preferences are stored in this browser only.">Settings</Title>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Theme"><div role="radiogroup" aria-label="Theme" className="flex gap-2">
        {(["dark", "light"] as Theme[]).map((t) => <button key={t} role="radio" aria-checked={theme === t} onClick={() => setTheme(t)} className={`rounded-lg border px-4 py-2 text-sm capitalize ${theme === t ? "border-iris bg-iris/20" : "border-line"}`}>{t}</button>)}</div></Card>
      <Card title="Prediction history"><p className="mb-3 text-sm text-muted">{n} saved in this browser session.</p>
        <button disabled={n === 0} onClick={() => { clearHistory(); setN(0); }} className="rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-40">Clear history</button></Card>
      <Card title="API connection"><dl className="space-y-1 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted">API URL</dt><dd className="break-all">{API_URL}</dd></div></dl></Card>
      <Card title="Model health"><div role="status" className="space-y-1 text-sm">
        {h === null && <p className="text-muted">Checking…</p>}
        {h === "down" && <p className="text-pink-400">The API could not be reached. Start the backend and check VITE_API_URL.</p>}
        {h && h !== "down" && (<>
          <p>Status: {h.status}</p><p>Classifier loaded: {h.model_loaded ? "yes" : "no"}</p><p>Scaler loaded: {h.scaler_loaded ? "yes" : "no"}</p><p>Classifier type: {h.model_type ?? "unknown"}</p>{h.detail && <p className="text-pink-400">{h.detail}</p>}</>)}
        <button onClick={check} className="mt-2 rounded-lg border border-line px-3 py-1">Check again</button></div></Card>
    </div>
  </>);
}
