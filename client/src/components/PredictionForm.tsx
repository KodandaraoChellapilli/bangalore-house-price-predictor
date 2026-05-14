import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { PredictionRequest } from '../types/types'
import LoadingSpinner from './LoadingSpinner'

interface PredictionFormProps {
  locations: string[]
  locationsLoading: boolean
  predicting: boolean
  onPredict: (payload: PredictionRequest) => Promise<void>
}

const BHK_OPTIONS = [1, 2, 3, 4, 5]
const BATH_OPTIONS = [1, 2, 3, 4, 5]

function PredictionForm({
  locations,
  locationsLoading,
  predicting,
  onPredict,
}: PredictionFormProps) {
  const [totalSqft, setTotalSqft] = useState('')
  const [bhk, setBhk] = useState<number>(2)
  const [bath, setBath] = useState<number>(2)
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const locationOptions = useMemo(
    () => [...locations].sort((a, b) => a.localeCompare(b)),
    [locations],
  )

  const resetError = () => {
    if (error) {
      setError(null)
    }
  }

  const validate = () => {
    const sqft = Number(totalSqft)
    if (!totalSqft || Number.isNaN(sqft) || sqft <= 200) {
      return 'Please enter a valid square feet value greater than 200.'
    }
    if (!location) {
      return 'Please select a location to continue.'
    }
    if (bath > bhk + 1) {
      return 'Bathrooms cannot exceed BHK by more than 1.'
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    await onPredict({
      total_sqft: Number(totalSqft),
      bhk,
      bath,
      location,
    })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-panel p-6 sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-white">Estimate Property Price</h2>
      <p className="mt-2 text-sm text-slate-300">Fill details below for an AI-powered valuation.</p>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="sqft" className="text-sm font-medium text-slate-200">
            Area (Square Feet)
          </label>
          <input
            id="sqft"
            type="number"
            min={100}
            placeholder="Enter square feet"
            value={totalSqft}
            onChange={(e) => {
              resetError()
              setTotalSqft(e.target.value)
            }}
            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">BHK</p>
          <div className="grid grid-cols-5 gap-2">
            {BHK_OPTIONS.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  resetError()
                  setBhk(value)
                }}
                className={`selection-chip ${bhk === value ? 'selection-chip-active' : ''}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">Bathrooms</p>
          <div className="grid grid-cols-5 gap-2">
            {BATH_OPTIONS.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  resetError()
                  setBath(value)
                }}
                className={`selection-chip ${bath === value ? 'selection-chip-active' : ''}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-slate-200">
            Location
          </label>
          {locationsLoading ? (
            <div className="skeleton h-12 w-full rounded-xl" />
          ) : (
            <select
              id="location"
              value={location}
              onChange={(e) => {
                resetError()
                setLocation(e.target.value)
              }}
              className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            >
              <option value="">Select location</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={predicting || locationsLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-semibold text-slate-900 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {predicting ? <LoadingSpinner label="Estimating price..." /> : 'Estimate Price'}
        </button>
      </form>
    </motion.section>
  )
}

export default PredictionForm
