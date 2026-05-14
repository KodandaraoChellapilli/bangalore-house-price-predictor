export interface PredictionRequest {
  total_sqft: number
  bhk: number
  bath: number
  location: string
}

export interface PredictionResponse {
  estimated_price: number
}

export interface LocationsResponse {
  locations: string[]
}

export interface PredictionHistoryItem {
  id: string
  createdAt: string
  input: PredictionRequest
  estimated_price: number
}
