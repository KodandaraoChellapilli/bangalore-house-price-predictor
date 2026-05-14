import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import PredictionForm from './components/PredictionForm'
import PriceResult from './components/PriceResult'
import { getLocations, predictPrice } from './services/api'
import type { PredictionHistoryItem, PredictionRequest } from './types/types'

const HISTORY_KEY = 'estateiq.predictionHistory'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [locations, setLocations] = useState<string[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [history, setHistory] = useState<PredictionHistoryItem[]>([])

  useEffect(() => {
    const existingTheme = localStorage.getItem('estateiq.theme')
    if (existingTheme) {
      setDarkMode(existingTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('estateiq.theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const rawHistory = localStorage.getItem(HISTORY_KEY)
    if (rawHistory) {
      try {
        const parsed: PredictionHistoryItem[] = JSON.parse(rawHistory)
        setHistory(parsed)
      } catch {
        setHistory([])
      }
    }
  }, [])

  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true)
      try {
        const data = await getLocations()
        setLocations(data)
      } catch {
        toast.error('Unable to load locations. Please check backend service.')
      } finally {
        setLocationsLoading(false)
      }
    }

    void fetchLocations()
  }, [])

  const latestEstimatedPrice = useMemo(() => estimatedPrice, [estimatedPrice])

  const handlePredict = async (payload: PredictionRequest) => {
    setPredicting(true)
    try {
      const response = await predictPrice(payload)
      setEstimatedPrice(response.estimated_price)

      const newEntry: PredictionHistoryItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input: payload,
        estimated_price: response.estimated_price,
      }

      setHistory((prev) => {
        const updated = [newEntry, ...prev].slice(0, 12)
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
        return updated
      })

      toast.success('Price estimated successfully.')
    } catch {
      toast.error('Prediction failed. Please verify inputs and API status.')
    } finally {
      setPredicting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <Hero />

      <main className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
          <PredictionForm
            locations={locations}
            locationsLoading={locationsLoading}
            predicting={predicting}
            onPredict={handlePredict}
          />
          <PriceResult estimatedPrice={latestEstimatedPrice} history={history} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
