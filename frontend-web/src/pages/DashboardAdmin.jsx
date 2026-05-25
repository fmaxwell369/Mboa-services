import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function DashboardAdmin() {
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetchRequests();
}, []);

const fetchRequests = async () => {
    try {
    setLoading(true);
    setError(null);
    const response = await axios.get(`${API_URL}/my-requests/`);
    
      // SÉCURITÉ : On vérifie si la réponse est bien un tableau. 
      // Si Django renvoie une pagination (ex: response.data.results), on prend les results.
    if (Array.isArray(response.data)) {
        setRequests(response.data);
    } else if (response.data && Array.isArray(response.data.results)) {
        setRequests(response.data.results);
    } else {
        setRequests([]);
        console.log("Format reçu inconnu :", response.data);
    }
    
    setLoading(false);
    } catch (err) {
    console.error(err);
    setError("Erreur lors de la récupération des données.");
    setLoading(false);
    }
};

const handleStatusChange = async (requestId, newStatus) => {
    try {
    await axios.patch(`${API_URL}/my-requests/${requestId}/`, { status: newStatus });
    setRequests(requests.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    alert("Statut mis à jour !");
    } catch (err) {
    console.error(err);
    alert("Erreur de mise à jour.");
    }
};

const getStatusBadge = (status) => {
    switch (status) {
    case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
    case 'VALIDATED': return 'bg-green-100 text-green-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
    }
};

if (loading) return <div className="text-center p-10 text-gray-600">Chargement...</div>;
if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📋 Suivi des Demandes Administratives</h1>
        <button onClick={fetchRequests} className="bg-blue-600 text-white px-4 py-2 rounded shadow text-sm">
            Actualiser 🔄
        </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Suivi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Démarche</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* SÉCURITÉ : Ajout de la protection ?. pour éviter les crashs si la liste est vide */}
            {requests?.map((req) => (
                <tr key={req?.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold">
                    {req?.tracking_number || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {req?.service_details?.name || req?.service || "Service inconnu"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getStatusBadge(req?.status)}`}>
                    {req?.status || "Inconnu"}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                    value={req?.status || "SUBMITTED"}
                    onChange={(e) => handleStatusChange(req?.id, e.target.value)}
                    className="border rounded px-2 py-1 bg-white"
                    >
                    <option value="SUBMITTED">Soumis</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="VALIDATED">Validé</option>
                    <option value="REJECTED">Rejeté</option>
                    </select>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        {(!requests || requests.length === 0) && (
            <div className="text-center p-8 text-gray-500 italic">Aucune demande trouvée.</div>
        )}
        </div>
    </div>
    </div>
    );
}