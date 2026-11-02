const statusConfig = {
  pending: {
    label: 'En attente',
    className: 'bg-amber-500/10 text-amber-400',
  },
  certified: {
    label: 'Certifié',
    className: 'bg-emerald-500/10 text-emerald-400',
  },
  accepted: {
    label: 'Accepté',
    className: 'bg-emerald-500/10 text-emerald-400',
  },
  rejected: {
    label: 'Rejeté',
    className: 'bg-red-500/10 text-red-400',
  },
  completed: {
    label: 'Terminé',
    className: 'bg-emerald-500/10 text-emerald-400',
  },
};

export default function StatusBadge({ status }) {
  const normalizedStatus = String(status || 'pending').toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    label: status || 'Inconnu',
    className: 'bg-slate-500/10 text-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
