import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            EstateIQ Platform
          </p>

          <h1 className="text-balance text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            AI-Powered Bangalore Property Intelligence
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Predict property prices, explore market trends, and make smarter real estate decisions
            using machine learning.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#predict"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform duration-200 hover:scale-[1.02]"
            >
              Predict Price
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/70 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/20 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-cyan-300 dark:hover:text-cyan-200"
            >
              Explore Insights
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-panel relative overflow-hidden rounded-3xl border border-white/35 p-6 shadow-2xl shadow-cyan-500/10 dark:border-white/15"
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Product Preview
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                Simple, fast, and reliable property intelligence
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/50">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Workflow
                </p>
                <p className="mt-1 text-base font-medium text-slate-800 dark:text-slate-100">
                  Enter property details and get model-based price estimates instantly.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/50">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Intelligence Layer
                </p>
                <p className="mt-1 text-base font-medium text-slate-800 dark:text-slate-100">
                  Combine price predictions, trend context, and AI guidance in one clean interface.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
