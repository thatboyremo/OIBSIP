import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type Theme = "dark" | "light";
const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: "dark", setTheme: () => {} });
const initial = (): Theme => {
  const d = document.documentElement.dataset.theme;
  return d === "light" ? "light" : "dark";
};
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initial);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("iris-theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
