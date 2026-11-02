import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ?? 'Identifiants invalides'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 text-slate-200">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-brand">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Mboa-Services
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Votre plateforme de certification des démarches administratives
          </p>
        </div>

        <section className="rounded-2xl border border-bg-border bg-bg-card p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-semibold text-white">
            Connexion
          </h2>
          <p className="mt-2 mb-6 text-sm text-slate-400">
            Accédez à votre espace de certification
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="Adresse e-mail"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Se connecter
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              className="font-medium text-brand hover:text-brand-hover"
            >
              Créer un compte
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          Mboa-Services · Simplifier les démarches administratives
        </p>
      </div>
    </main>
  );
}