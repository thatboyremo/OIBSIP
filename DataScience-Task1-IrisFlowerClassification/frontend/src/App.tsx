import { useCallback, useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Activity, BarChart3, Database, Flower2, History as HistoryIcon, Home, Info, Menu, Moon, Settings as SettingsIcon, Sparkles, Sun, X } from "lucide-react";
import { getHealth, type Health } from "./services/api";
import { useTheme } from "./lib/theme";
import Overview from "./pages/Overview";
import Predictor from "./pages/Predictor";
import SpeciesPage from "./pages/Species";
import Dataset from "./pages/Dataset";
import Evaluation from "./pages/Evaluation";
import HistoryPage from "./pages/History";
import Settings from "./pages/Settings";
import About from "./pages/About";

const NAV = [
  { to: "/", label: "Overview", icon: Home }, { to: "/predict", label: "Live Predictor", icon: Sparkles },
  { to: "/species", label: "Species Explorer", icon: Flower2 }, { to: "/dataset", label: "Dataset Explorer", icon: Database },
  { to: "/evaluation", label: "Model Evaluation", icon: BarChart3 }, { to: "/history", label: "Prediction History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon }, { to: "/about", label: "About", icon: Info },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState<Health | "down" | null>(null);
  const { theme, setTheme } = useTheme(); const loc = useLocation();
  const check = useCallback(() => { setHealth(null); getHealth().then(setHealth).catch(() => setHealth("down")); }, []);
  useEffect(check, [check]);
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  const ready = health && health !== "down" && health.status === "ok";
  const label = health === null ? "Checking API…" : ready ? "Model ready" : health === "down" ? "API unreachable" : "Model not loaded";
  const toggle = (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} className="rounded-lg border border-line p-2">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>);

  return (
    <div className="min-h-screen md:flex">
      <header className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 md:hidden">
        <span className="font-semibold">Iris AI Studio</span>
        <div className="flex items-center gap-2">{toggle}<button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="p-2">{open ? <X /> : <Menu />}</button></div>
      </header>
      <nav aria-label="Main" className={`${open ? "block" : "hidden"} border-r border-line bg-panel p-4 md:sticky md:top-0 md:block md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto`}>
        <div className="mb-6 hidden items-center justify-between md:flex"><span className="text-lg font-semibold">Iris AI Studio</span>{toggle}</div>
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}><NavLink to={to} end={to === "/"} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-iris/20 font-medium text-text" : "text-muted hover:bg-iris/10"}`}>
              <Icon size={16} />{label}</NavLink></li>
          ))}
        </ul>
        <button onClick={check} className="mt-6 flex w-full items-center gap-2 rounded-lg border border-line px-3 py-2 text-left text-xs text-muted" title="Re-check API health">
          <Activity size={14} className={ready ? "text-emerald-500" : "text-amber-500"} /><span role="status">{label}</span>
        </button>
      </nav>
      <main className="min-w-0 flex-1 p-4 md:p-10">
        <Routes>
          <Route path="/" element={<Overview health={health} />} /><Route path="/predict" element={<Predictor />} />
          <Route path="/species" element={<SpeciesPage />} /><Route path="/dataset" element={<Dataset />} />
          <Route path="/evaluation" element={<Evaluation />} /><Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<Settings />} /><Route path="/about" element={<About />} />
          <Route path="*" element={<p className="text-muted">Page not found. Use the navigation to continue.</p>} />
        </Routes>
      </main>
    </div>
  );
}
