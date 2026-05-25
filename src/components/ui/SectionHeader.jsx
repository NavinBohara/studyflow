export default function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
}
