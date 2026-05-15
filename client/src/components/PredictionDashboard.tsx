import { motion } from 'framer-motion'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import type { PredictionHistoryItem } from '../types/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
)

interface PredictionDashboardProps {
  history: PredictionHistoryItem[]
  estimatedPrice: number | null
}

function PredictionDashboard({ history, estimatedPrice }: PredictionDashboardProps) {
  const latestTen = history.slice(0, 10).reverse()

  const prices = history.map((item) => item.estimated_price)
  const totalPredictions = history.length
  const averagePrice =
    prices.length === 0 ? 0 : prices.reduce((sum, value) => sum + value, 0) / prices.length
  const maxPrice = prices.length === 0 ? 0 : Math.max(...prices)
  const minPrice = prices.length === 0 ? 0 : Math.min(...prices)

  const locationCounts = history.reduce<Record<string, number>>((acc, item) => {
    acc[item.input.location] = (acc[item.input.location] ?? 0) + 1
    return acc
  }, {})

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const trendData = {
    labels: latestTen.map((item) =>
      new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ),
    datasets: [
      {
        label: 'Predicted Price (Lakhs)',
        data: latestTen.map((item) => item.estimated_price),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.12)',
        fill: true,
        tension: 0.35,
      },
    ],
  }

  const locationData = {
    labels: topLocations.map(([location]) => location),
    datasets: [
      {
        label: 'Prediction Count',
        data: topLocations.map(([, count]) => count),
        backgroundColor: 'rgba(129, 140, 248, 0.75)',
        borderRadius: 8,
      },
    ],
  }

  return (
    <motion.section
      id="dashboard"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-panel mt-6 rounded-3xl border border-white/35 p-6 shadow-2xl shadow-violet-500/10 dark:border-white/10 sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Prediction Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Live analytics from your recent housing predictions.
          </p>
        </div>
        {estimatedPrice !== null && (
          <div className="rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-700 dark:text-cyan-200">
            Latest estimate: Rs. {estimatedPrice.toFixed(2)} Lakhs
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Run a prediction to unlock dashboard insights and charts.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Predictions
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{totalPredictions}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Average Price
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                Rs. {averagePrice.toFixed(1)}L
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Highest Price
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Rs. {maxPrice.toFixed(1)}L</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Lowest Price
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Rs. {minPrice.toFixed(1)}L</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                Price Trend (Last 10)
              </p>
              <Line
                data={trendData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      ticks: { color: '#94a3b8' },
                      grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    },
                    x: {
                      ticks: { color: '#94a3b8' },
                      grid: { color: 'rgba(148, 163, 184, 0.2)' },
                    },
                  },
                }}
              />
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                Top Predicted Locations
              </p>
              {topLocations.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">No location stats yet.</p>
              ) : (
                <Bar
                  data={locationData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          color: '#94a3b8',
                          precision: 0,
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.2)' },
                      },
                      x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </motion.section>
  )
}

export default PredictionDashboard
