import { useEffect, useState } from 'react';
import { usersApi } from '../api/endpoints';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi.list()
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des utilisateurs…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
      <h1>Gestion des utilisateurs</h1>
      {users.length === 0 ? (
        <p>Aucun utilisateur à afficher.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id || user.id}>
              {user.name || user.fullName || user.email || 'Utilisateur'} — {user.role || 'Sans rôle'}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}