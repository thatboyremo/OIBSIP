export type CategoricalField = 'brand' | 'seller_type' | 'fuel_type' | 'transmission_type'

/** Exactly the features the trained pipeline expects (see backend/predictor.py). */
export interface VehicleInput {
  brand: string
  vehicle_age: number
  km_driven: number
  seller_type: string
  fuel_type: string
  transmission_type: string
  mileage: number
  engine: number
  max_power: number
  seats: number
}

export interface PredictionResponse {
  predicted_price: number
}

export interface MetadataResponse {
  options: Record<CategoricalField, string[]>
}

export interface HistoryEntry {
  id: string
  createdAt: string // ISO timestamp
  input: VehicleInput
  predictedPrice: number
}

export type ApiErrorCode = 'network' | 'model_unavailable' | 'invalid_input' | 'unknown'
