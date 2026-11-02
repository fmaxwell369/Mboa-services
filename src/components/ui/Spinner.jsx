export default function Spinner({ className = '' }) {
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-transparent ${className}`}
    />
  );
}