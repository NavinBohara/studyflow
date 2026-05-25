import GlassCard from './GlassCard';

export default function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <GlassCard className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4" />
        <p className="text-sm">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
    </GlassCard>
  );
}
