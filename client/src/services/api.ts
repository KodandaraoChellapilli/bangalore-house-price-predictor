import axios from 'axios'
import type {
  LocationsResponse,
  PredictionRequest,
  PredictionResponse,
} from '../types/types'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (import.meta.env.PROD && !configuredBaseUrl) {
  throw new Error('VITE_API_BASE_URL must be set in production.')
}

const API_BASE_URL = (configuredBaseUrl || 'http://127.0.0.1:5000').replace(/\/+$/, '')

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
