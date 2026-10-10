/**
 * Fill these in AFTER you evaluate the model on held-out data.
 * Nothing is displayed for values left undefined. Do not guess.
 * Enter values in the MODEL's own currency unit (as measured at evaluation); they are converted for display.
 *
 *   export const modelMetrics: ModelMetrics = { mae: 12345, rmse: 23456, r2: 0.9, evaluatedOn: 'Hold-out test set (20%)' }
 */
export interface ModelMetrics {
  mae?: number
  rmse?: number
  r2?: number
  evaluatedOn?: string
}

export const modelMetrics: ModelMetrics = {}
