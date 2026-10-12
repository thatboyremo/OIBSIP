import type { Measurements } from "./species";
import type { Prediction } from "../services/api";
export interface HistoryItem { at: string; input: Measurements; result: Prediction }
const KEY = "iris-history";
export const readHistory = (): HistoryItem[] => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? "[]"); } catch { return []; } };
export const addHistory = (i: HistoryItem) => { try { sessionStorage.setItem(KEY, JSON.stringify([i, ...readHistory()].slice(0, 50))); } catch { /* storage unavailable */ } };
export const clearHistory = () => { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } };
