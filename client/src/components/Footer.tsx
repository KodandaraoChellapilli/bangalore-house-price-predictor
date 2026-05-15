import { FaGithub, FaLinkedinIn } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-slate-950 px-4 py-10 text-slate-300 dark:border-white/10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div>
          <h3 className="text-xl font-semibold text-white">EstateIQ</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            AI-powered Bangalore real estate intelligence platform for accurate pricing insights and
            smarter property decisions.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/vinodh-chellapilli/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-400 opacity-90 shadow-sm transition-all duration-300 hover:scale-110 hover:border-cyan-300/70 hover:text-white hover:opacity-100 hover:shadow-cyan-500/20"
            >
              <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/KodandaraoChellapilli"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-400 opacity-90 shadow-sm transition-all duration-300 hover:scale-110 hover:border-cyan-300/70 hover:text-white hover:opacity-100 hover:shadow-cyan-500/20"
            >
              <FaGithub className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-500">
        <p>&copy; 2026 EstateIQ Technologies</p>
      </div>
    </footer>
  )
}

export default Footer
