export interface ModelEval { name: string; selected: boolean; provenance?: string; accuracy: number; macro: Record<string, number>;
  per_class: Record<string, Record<string, number>>; confusion_matrix: number[][] }
export interface Evaluation { labels: string[]; train_samples: number; test_samples: number; source: string; models: ModelEval[]; verification?: { check: string; passed: boolean }[] }

export function validateEvaluation(d: any): Evaluation | null {
  const ok = d && (d.schema_version === 1 || d.schema_version === 2) && Array.isArray(d.labels) && Array.isArray(d.models) && d.models.length > 0 &&
    d.models.every((m: any) => typeof m.name === "string" && typeof m.accuracy === "number" && m.macro && m.per_class &&
      Array.isArray(m.confusion_matrix) && m.confusion_matrix.length === d.labels.length);
  return ok ? (d as Evaluation) : null;
}
export async function loadEvaluation(): Promise<Evaluation | null> {
  try { const r = await fetch("/evaluation.json"); return r.ok ? validateEvaluation(await r.json()) : null; } catch { return null; }
}
