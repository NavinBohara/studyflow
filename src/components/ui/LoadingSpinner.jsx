export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div
      className={`animate-spin rounded-full border-brand-200 border-t-brand-600 dark:border-white/20 dark:border-t-brand-400 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
