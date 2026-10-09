import type { PredictionResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function detectSpam(
  message: string,
  model: 'naive_bayes' | 'logistic_regression',
): Promise<PredictionResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, model }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message =
      errorBody?.error ||
      `Server returned ${response.status}. Predictions may be temporarily unavailable.`
    throw new Error(message)
  }

  return response.json()
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
