import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Paramètres</h1>
      <p>Informations du compte</p>
      <p>Nom : {user?.name || user?.fullName || 'Non renseigné'}</p>
      <p>Email : {user?.email || 'Non renseigné'}</p>
      <p>Rôle : {user?.role || 'Non renseigné'}</p>
    </section>
  );
}