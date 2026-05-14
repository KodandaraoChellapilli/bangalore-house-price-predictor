import { motion } from 'framer-motion'

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#8b5cf655,transparent_50%),radial-gradient(circle_at_20%_80%,#06b6d444,transparent_45%)]" />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 sm:p-10"
        >
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1 text-xs font-medium tracking-wide text-cyan-200">
            Real Estate AI SaaS
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
            Predict Bangalore home prices with intelligent, location-aware machine learning.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Get fast and transparent price estimates using area, BHK, bathrooms, and locality data.
            Built for consultants, home buyers, and real estate teams.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
