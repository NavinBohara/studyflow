export default function ProgressBar({ value = 0, max = 100, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}>
      <div
        className="h-full rounded-full bg-brand-600 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
