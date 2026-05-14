import { motion } from 'framer-motion'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { PredictionHistoryItem } from '../types/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface PriceResultProps {
  estimatedPrice: number | null
  history: PredictionHistoryItem[]
}

function PriceResult({ estimatedPrice, history }: PriceResultProps) {
  const latestFive = history.slice(0, 5).reverse()

  const chartData = {
    labels: latestFive.map((item) =>
      new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ),
    datasets: [
      {
        label: 'Estimated Price (Lakhs)',
        data: latestFive.map((item) => item.estimated_price),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        tension: 0.35,
        fill: true,
      },
    ],
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-panel p-6 sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-white">Prediction Insights</h2>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        {estimatedPrice === null ? (
          <p className="text-sm text-slate-300">Your estimated price will appear here after prediction.</p>
        ) : (
          <>
            <p className="text-sm uppercase tracking-wide text-cyan-300">Estimated Price</p>
            <p className="mt-2 text-4xl font-bold text-white">Rs. {estimatedPrice.toFixed(2)} Lakhs</p>
            <p className="mt-2 text-sm text-slate-300">Calculated using Bangalore location-driven model features.</p>
          </>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <p className="mb-3 text-sm font-medium text-slate-200">Recent Trend</p>
          <Line
            data={chartData}
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
                    color: '#cbd5e1',
                  },
                  grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                  },
                },
                x: {
                  ticks: {
                    color: '#cbd5e1',
                  },
                  grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                  },
                },
              },
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-200">Prediction History</p>
        {history.length === 0 ? (
          <p className="text-sm text-slate-300">No previous predictions yet.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{item.input.location}</span>
                  <span className="font-semibold text-cyan-300">Rs. {item.estimated_price.toFixed(2)}L</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {item.input.total_sqft} sqft | {item.input.bhk} BHK | {item.input.bath} Bath
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default PriceResult
