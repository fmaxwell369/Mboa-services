import { useEffect, useState } from 'react';
import { FileText, ShieldCheck, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../services/documentService';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/documents/StatusBadge';
import { formatDate } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const response = await getStats();

        if (!mounted) return;

        const data = response?.data ?? response;
        setStats(data?.stats ?? {});
        setRecent(data?.recent ?? []);
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              'Impossible de charger les statistiques.'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    {
      label: 'Documents',
      value: stats?.total ?? 0,
      icon: FileText,
    },
    {
      label: 'Certifiés',
      value: stats?.certified ?? 0,
      icon: ShieldCheck,
    },
    {
      label: 'En attente',
      value: stats?.pending ?? 0,
      icon: Clock,
    },
    {
      label: 'Rejetés',
      value: stats?.rejected ?? 0,
      icon: XCircle,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour {user?.name?.split(' ')[0] ?? ''} 👋
        </h1>
        <p className="mt-2 text-slate-400">
          Voici un aperçu de votre activité de certification.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-red-500">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className="rounded-xl bg-white/5 p-3">
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Documents récents</h2>
          <Link to="/documents" className="text-sm">
            Tout voir →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-slate-400">Aucun document pour le moment.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {recent.map((doc) => (
              <li
                key={doc._id ?? doc.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText size={20} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{doc.title}</p>
                    <p className="text-sm text-slate-400">
                      {doc.createdAt ? formatDate(doc.createdAt) : 'Date inconnue'}
                    </p>
                  </div>
                </div>

                <StatusBadge status={doc.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}