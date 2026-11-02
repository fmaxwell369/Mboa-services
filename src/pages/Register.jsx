import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Inscription impossible.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="mt-2 mb-6">
          Rejoignez la plateforme de certification.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Jean Dupont"
            required
          />

          <Input
            label="Adresse e-mail"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="vous@exemple.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Au moins 8 caractères"
            required
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={onChange}
            placeholder="Confirme ton mot de passe"
            required
          />

          {error && (
            <p role="alert" className="text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Création en cours…' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="mt-6">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}