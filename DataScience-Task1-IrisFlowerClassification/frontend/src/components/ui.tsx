import type { ReactNode } from "react";
export const Card = ({ title, children }: { title?: string; children: ReactNode }) => (
  <section className="rounded-xl border border-line bg-panel p-5">{title && <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>}{children}</section>);
export const Stat = ({ label, value, note }: { label: string; value: ReactNode; note?: string }) => (
  <div className="rounded-xl border border-line bg-panel p-4"><div className="text-xs text-muted">{label}</div><div className="mt-1 text-2xl font-semibold">{value}</div>{note && <div className="mt-1 text-xs text-muted">{note}</div>}</div>);
export const Title = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <div className="mb-6"><h1 className="text-2xl font-semibold md:text-3xl">{children}</h1>{sub && <p className="mt-2 max-w-2xl text-muted">{sub}</p>}</div>);
