import { motion } from 'framer-motion'
import { Bath, BedDouble, Building, Ruler } from 'lucide-react'
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
      id="predict"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="glass-panel rounded-3xl border border-white/35 p-6 shadow-2xl shadow-indigo-500/10 dark:border-white/10 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Predict Property Price
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Enter property details for an AI valuation in seconds.
          </p>
        </div>
        <div className="hidden rounded-xl border border-cyan-300/35 bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-200 sm:block">
          ML Active
        </div>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="sqft"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            <Ruler className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
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
            className="w-full rounded-2xl border border-slate-300/75 bg-white/75 px-4 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 dark:border-white/15 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <BedDouble className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            BHK
          </p>
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
          <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Bath className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            Bathrooms
          </p>
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
          <label
            htmlFor="location"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            <Building className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            Location
          </label>
          {locationsLoading ? (
            <div className="skeleton h-14 w-full rounded-2xl" />
          ) : (
            <select
              id="location"
              value={location}
              onChange={(e) => {
                resetError()
                setLocation(e.target.value)
              }}
              className="w-full rounded-2xl border border-slate-300/75 bg-white/75 px-4 py-3.5 text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 dark:border-white/15 dark:bg-slate-900/70 dark:text-white"
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
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={predicting || locationsLoading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-4 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {predicting ? <LoadingSpinner label="Estimating price..." /> : 'Predict Property Price'}
        </motion.button>
      </form>
    </motion.section>
  )
}

export default PredictionForm
