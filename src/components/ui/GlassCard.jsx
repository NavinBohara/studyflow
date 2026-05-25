/** Simple card container */
export default function GlassCard({
  children,
  className = '',
  onClick,
  hover = false,
}) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick(e);
            }
          : undefined
      }
      className={`simple-card ${hover ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
