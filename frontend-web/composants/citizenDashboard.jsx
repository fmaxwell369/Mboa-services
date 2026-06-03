import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, FileText, Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import NewRequestForm from './NewRequestForm'; // Importation de notre nouveau formulaire

const CitizenDashboard = () => {
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
const [showForm, setShowForm] = useState(false); // État pour basculer l'affichage

  // On isole la fonction de chargement pour pouvoir la rappeler après une création
const fetchCitizenData = async () => {
    setLoading(true);
    try {
    const response = await axios.get('http://localhost:8000/api/my-requests/');
    setRequests(response.data);

    const total = response.data.length;
    const pending = response.data.filter(r => r.status === 'En cours' || r.status === 'En attente').length;
    const completed = response.data.filter(r => r.status === 'Validé').length;

    setStats({ total, pending, completed });
    setLoading(false);
    } catch (error) {
    console.error("Erreur lors du chargement du dashboard citoyen:", error);
    setLoading(false);
    }
};

useEffect(() => {
    fetchCitizenData();
}, []);

const handleFormSuccess = () => {
    setShowForm(false); // On ferme le formulaire
    fetchCitizenData(); // On recharge les données mises à jour depuis Django
};

const getStatusBadge = (status) => {
    const styles = {
    'En attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'En cours': 'bg-blue-100 text-blue-800 border-blue-200',
    'Validé': 'bg-green-100 text-green-800 border-green-200',
    'Rejeté': 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
};

if (loading && !showForm) {
    return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* CONDITION : Si showForm est vrai, on affiche le formulaire */}
    {showForm ? (
        <div className="max-w-6xl mx-auto">
          {/* Bouton retour rapide */}
        <button
            onClick={() => setShowForm(false)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
            <ArrowLeft size={18} />
            Retour au tableau de bord
        </button>

        <NewRequestForm
            onFormSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
        />
        </div>
    ) : (
        /* SINON : On affiche le Dashboard classique */
        <div className="max-w-6xl mx-auto">

          {/* En-tête de la page */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Citoyen</h1>
            <p className="text-gray-500 mt-1">Suivez vos démarches administratives en temps réel.</p>
            </div>
            
            {/* Bouton d'action qui ouvre le formulaire */}
            <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 gap-2"
            >
            <PlusCircle size={20} />
            Nouvelle demande de service
            </button>
        </div>

          {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Toutes mes demandes</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</h3>
            </div>
            <div className="p-4 bg-gray-100 text-gray-600 rounded-xl">
                <FileText size={24} />
            </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">En traitement</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats.pending}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                <Clock size={24} />
            </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Documents délivrés</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</h3>
            </div>
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle size={24} />
            </div>
            </div>
        </div>

          {/* Liste des demandes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Historique de mes dossiers</h2>
            </div>

            {requests.length === 0 ? (
            <div className="p-12 text-center">
                <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 text-lg">Vous n'avez soumis aucune demande pour le moment.</p>
            </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/70 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                    <th className="p-4 pl-6">Service Demandé</th>
                    <th className="p-4">Date de soumission</th>
                    <th className="p-4">Région / Centre</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                    {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-gray-900">{req.service_name}</td>
                        <td className="p-4 text-gray-500">{new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="p-4 text-gray-600">{req.region}</td>
                        <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(req.status)}`}>
                            {req.status}
                        </span>
                        </td>
                        <td className="p-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 text-xs">
                            Suivre l'avancement
                            <ArrowRight size={14} />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    )}
    </div>
);
};

export default CitizenDashboard;