import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsApi } from '../api/endpoints';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError('Choisis un fichier à envoyer.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setLoading(true);
      setError('');
      await documentsApi.create(formData);
      navigate('/documents');
    } catch (err) {
      setError(err.response?.data?.message || "Impossible d'envoyer le document.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Déposer un document</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="title">Titre</label><br />
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </p>
        <p>
          <label htmlFor="description">Description</label><br />
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </p>
        <p>
          <label htmlFor="file">Fichier</label><br />
          <input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        </p>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours…' : 'Envoyer le document'}
        </button>
      </form>
    </section>
  );
}