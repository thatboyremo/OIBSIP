import { API_URL } from '../config'
import type { ApiErrorCode, MetadataResponse, PredictionResponse, VehicleInput } from '../types'

const MESSAGES: Record<ApiErrorCode, string> = {
  network: 'Unable to connect to the prediction service. Please make sure the prediction server is running.',
  model_unavailable: 'The prediction model is currently unavailable.',
  invalid_input: 'Please check the vehicle details and try again.',
  unknown: 'Something went wrong. Please try again.',
}

export class ApiError extends Error {
  code: ApiErrorCode
  constructor(code: ApiErrorCode) {
    super(MESSAGES[code])
    this.code = code
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 30_000)
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, signal: ctrl.signal })
  } catch {
    throw new ApiError('network')
  } finally {
    clearTimeout(timer)
  }
  if (!res.ok) {
    let code: ApiErrorCode = 'unknown'
    try {
      const body = (await res.json()) as { error?: { code?: string } }
      const c = body.error?.code
      if (c === 'model_unavailable' || res.status === 503) code = 'model_unavailable'
      else if (c === 'invalid_input' || c === 'invalid_category' || res.status === 422) code = 'invalid_input'
    } catch {
      if (res.status === 503) code = 'model_unavailable'
    }
    throw new ApiError(code)
  }
  try {
    return (await res.json()) as T
  } catch {
    throw new ApiError('unknown')
  }
}

export const getMetadata = () => request<MetadataResponse>('/metadata')

export const predictPrice = (input: VehicleInput) =>
  request<PredictionResponse>('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
