function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 sm:flex-row">
        <p>EstateIQ © {new Date().getFullYear()} - AI-powered Bangalore housing insights.</p>
        <p>Built with React, Flask, and Scikit-learn.</p>
      </div>
    </footer>
  )
}

export default Footer
