import type { Measurements } from "../lib/species";
const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
export interface Prediction { prediction: string; prediction_index: number; probabilities: Record<string, number> | null; model_name: string }
export interface Health { status: string; model_loaded: boolean; scaler_loaded: boolean; model_type: string | null; detail?: string | null }
export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit, timeoutMs = 8000): Promise<T> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, { ...init, signal: ctl.signal, headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try { const b = await res.json(); if (res.status === 422) msg = "Some measurements are invalid. Check the ranges and try again."; else if (b.detail) msg = String(b.detail); } catch { /* keep default */ }
      throw new ApiError(msg);
    }
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(ctl.signal.aborted ? "The API timed out." : "Cannot reach the API. Check that the backend is running.");
  } finally { clearTimeout(t); }
}
export const getHealth = () => request<Health>("/api/v1/health", undefined, 4000);
export const predict = (m: Measurements) => request<Prediction>("/api/v1/predict", { method: "POST", body: JSON.stringify(m) });
export const API_URL = BASE;
