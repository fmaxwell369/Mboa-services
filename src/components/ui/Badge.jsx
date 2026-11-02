import { cn } from '../../utils/cn';

const styles = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  certified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const labels = {
  pending: 'En attente',
  certified: 'Certifié',
  rejected: 'Rejeté',
};

export default function Badge({ status = 'neutral', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles[status] ?? styles.neutral,
        className
      )}
    >
      {children ?? labels[status] ?? status}
    </span>
  );
}