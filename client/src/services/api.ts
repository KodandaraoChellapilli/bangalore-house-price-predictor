import axios from 'axios'
import type {
  LocationsResponse,
  PredictionRequest,
  PredictionResponse,
} from '../types/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getLocations = async (): Promise<string[]> => {
  const { data } = await api.get<LocationsResponse>('/get_location_names')
  return data.locations ?? []
}

export const predictPrice = async (
  payload: PredictionRequest,
): Promise<PredictionResponse> => {
  const { data } = await api.post<PredictionResponse>('/predict_home_price', payload)
  return data
}
