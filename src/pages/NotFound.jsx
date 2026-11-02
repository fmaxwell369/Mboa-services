import { Link } from 'react-router-dom';

export default function DocumentDetail() {
  return (
    <main>
      <h1>Page introuvable</h1>
      <p>La page demandée n'existe pas ou a été déplacée.</p>
      <Link to="/dashboard">Retour au tableau de bord</Link>
    </main>
  );
}