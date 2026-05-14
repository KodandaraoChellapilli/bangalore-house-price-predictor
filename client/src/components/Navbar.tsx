import { Moon, Sun } from 'lucide-react'

interface NavbarProps {
  darkMode: boolean
  onToggleTheme: () => void
}

function Navbar({ darkMode, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-slate-900">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-white">EstateIQ</p>
            <p className="text-xs text-slate-300">Bangalore Price Intelligence</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'} mode</span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
