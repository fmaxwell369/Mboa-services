import { useState } from 'react';
import { Search, ShieldCheck, ShieldX } from 'lucide-react';
import { verifyDocument } from '../services/documentService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { formatDate } from '../utils/format';

export default function Verify() {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await verifyDocument(reference.trim());
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ??
          'Aucun document trouvé pour cette référence.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Vérifier un document</h1>
        <p>
          Saisissez la référence d'un document pour vérifier son authenticité.
        </p>
      </div>

      
        <form onSubmit={handleSubmit}>
          
            
            
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Vérification…' : 'Vérifier'}
          </Button>
        </form>
      

      {loading && (
        <div>
          
        </div>
      )}

      {error && (
        <Card>
          <div>
            
            <div>
              <p>Document non trouvé</p>
              <p>{error}</p>
            </div>
          </div>
        </Card>
      )}

      {result && (
        <Card>
          <div>
            
            <div>
              <p>Document authentique</p>
              <p>
                Ce document a été certifié et n'a pas été modifié depuis.
              </p>
            </div>
          </div>

          <dl>
            <div>
              <dt>Titre</dt>
              <dd>{result.title}</dd>
            </div>
            <div>
              <dt>Émetteur</dt>
              <dd>{result.issuer ?? '—'}</dd>
            </div>
            <div>
              <dt>Certifié le</dt>
              <dd>{formatDate(result.certifiedAt)}</dd>
            </div>
            <div>
              <dt>Hash</dt>
              <dd>{result.hash}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}