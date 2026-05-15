import { Building2, Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface NavbarProps {
  darkMode: boolean
  onToggleTheme: () => void
}

function Navbar({ darkMode, onToggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: 'Predict', href: '#predict' },
    { label: 'Results', href: '#results' },
    { label: 'Dashboard', href: '#dashboard' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-950/70">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/25">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">EstateIQ</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">AI Property Intelligence</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#assistant"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-500/20 dark:text-cyan-200"
          >
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </a>
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm text-slate-700 transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl border border-slate-300/70 bg-white/70 p-2 text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-t border-slate-200/60 px-4 py-3 dark:border-white/10 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#assistant"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200"
            >
              AI Assistant
            </a>
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={onToggleTheme}
              className="rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-left text-sm text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-100"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Navbar
