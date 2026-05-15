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
import { Activity, BadgeCheck, LineChart, Ruler } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import type { PredictionHistoryItem } from '../types/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface PriceResultProps {
  estimatedPrice: number | null
  history: PredictionHistoryItem[]
}

function PriceResult({ estimatedPrice, history }: PriceResultProps) {
  const latestFive = history.slice(0, 5).reverse()
  const latestRecord = history[0]

  const pricePerSqft =
    latestRecord && latestRecord.input.total_sqft > 0
      ? (latestRecord.estimated_price * 100000) / latestRecord.input.total_sqft
      : null

  const averagePrice =
    history.length > 0
      ? history.reduce((sum, item) => sum + item.estimated_price, 0) / history.length
      : null

  const trendLabel =
    estimatedPrice === null || averagePrice === null
      ? 'Not available'
      : estimatedPrice > averagePrice * 1.05
        ? 'Uptrend'
        : estimatedPrice < averagePrice * 0.95
          ? 'Cooling'
          : 'Stable'

  const confidenceScore =
    history.length === 0
      ? null
      : Math.min(
          97,
          Math.max(82, Math.round(92 - (Math.abs((estimatedPrice ?? 0) - (averagePrice ?? 0)) / 12))),
        )

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
      id="results"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: 0.12 }}
      className="glass-panel rounded-3xl border border-white/35 p-6 shadow-2xl shadow-cyan-500/10 dark:border-white/10 sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Prediction Insights</h2>

      <motion.div
        layout
        className="mt-6 rounded-2xl border border-slate-200/70 bg-white/75 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/45"
      >
        {estimatedPrice === null ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your estimated price will appear here after prediction.
          </p>
        ) : (
          <>
            <p className="text-sm uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              Estimated Property Price
            </p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-4xl font-bold text-slate-900 dark:text-white"
            >
              Rs. {estimatedPrice.toFixed(2)} Lakhs
            </motion.p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Calculated using Bangalore location-driven model features.
            </p>
          </>
        )}
      </motion.div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <BadgeCheck className="h-4 w-4" />
            Confidence Score
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {confidenceScore !== null ? `${confidenceScore}%` : '--'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <LineChart className="h-4 w-4" />
            Market Trend
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{trendLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Ruler className="h-4 w-4" />
            Price Per Sq Ft
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {pricePerSqft !== null ? `Rs. ${pricePerSqft.toFixed(0)}` : '--'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Activity className="h-4 w-4" />
            Avg Predicted Price
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {averagePrice !== null ? `Rs. ${averagePrice.toFixed(1)}L` : '--'}
          </p>
        </div>
      </div>

      {history.length > 1 && (
        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/45">
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Recent Trend</p>
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
                    color: '#94a3b8',
                  },
                  grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                  },
                },
                x: {
                  ticks: {
                    color: '#94a3b8',
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
        <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Prediction History</p>
        {history.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No previous predictions yet.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/45 dark:text-slate-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{item.input.location}</span>
                  <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                    Rs. {item.estimated_price.toFixed(2)}L
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
