interface LoadingSpinnerProps {
  label?: string
}

function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-cyan-300" />
      <span className="text-sm text-slate-200">{label}</span>
    </div>
  )
}

export default LoadingSpinner
