import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
const [requests, setRequests] = useState([]);
const [filteredRequests, setFilteredRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  // États pour les filtres
const [searchTerm, setSearchTerm] = useState('');
const [selectedStatus, setSelectedStatus] = useState('Tous');
const [selectedRegion, setSelectedRegion] = useState('Toutes');

  // 1. Récupération des données depuis l'API Django
useEffect(() => {
    const fetchRequests = async () => {
    try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/my-requests/');
        setRequests(response.data);
        setFilteredRequests(response.data); // Initialement, on affiche tout
        setError(null);
    } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger les demandes depuis le serveur backend.");
    } finally {
        setLoading(false);
    }
    };

    fetchRequests();
}, []);

  // 2. Logique de filtrage combinée (Statut + Région + Recherche)
useEffect(() => {
    let result = requests;

    // Filtre par statut
    if (selectedStatus !== 'Tous') {
    result = result.filter(req => req.status === selectedStatus);
    }

    // Filtre par région
    if (selectedRegion !== 'Toutes') {
      // Ajuste 'req.region' selon le nom exact de la clé renvoyée par ton modèle Django
    result = result.filter(req => req.region === selectedRegion);
    }

    // Filtre par barre de recherche (Nom du citoyen ou ID)
    if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    result = result.filter(req => 
        (req.citizen_name || req.user || '').toLowerCase().includes(term) ||
        String(req.id).toLowerCase().includes(term)
    );
    }

    setFilteredRequests(result);
}, [selectedStatus, selectedRegion, searchTerm, requests]);

return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
    
      {/* En-tête */}
    <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Suivi des Services & Demandes</h1>
        <p className="mt-2 text-sm text-gray-600">
        Panneau d'administration global de Camerservices.
        </p>
    </header>

      {/* Cartes de Statistiques basées sur les données filtrées */}
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <span className="text-sm font-medium text-gray-500 uppercase">Demandes affichées</span>
        <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold text-gray-900">{filteredRequests.length}</span>
            <span className="ml-2 text-xs text-gray-400">sur {requests.length} globales</span>
        </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <span className="text-sm font-medium text-gray-500 uppercase">En Attente (Sélection)</span>
        <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold text-orange-600">
            {filteredRequests.filter(r => r.status === 'En attente' || r.status === 'PENDING').length}
            </span>
        </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <span className="text-sm font-medium text-gray-500 uppercase">Approuvées (Sélection)</span>
        <div className="flex items-baseline mt-2">
            <span className="text-3xl font-semibold text-green-600">
            {filteredRequests.filter(r => r.status === 'Approuvé' || r.status === 'APPROVED').length}
            </span>
        </div>
        </div>
    </section>

      {/* Barre de Filtres Dynamiques */}
    <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
        
          {/* Recherche textuelle */}
        <input
            type="text"
            placeholder="Rechercher un citoyen ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

          {/* Filtre par Statut */}
        <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Rejeté">Rejeté</option>
        </select>

          {/* Filtre par Région */}
        <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="Toutes">Toutes les régions</option>
            <option value="Centre">Centre</option>
            <option value="Littoral">Littoral</option>
            <option value="Adamaoua">Adamaoua</option>
            <option value="Est">Est</option>
            <option value="Extrême-Nord">Extrême-Nord</option>
            <option value="Nord">Nord</option>
            <option value="Nord-Ouest">Nord-Ouest</option>
            <option value="Ouest">Ouest</option>
            <option value="Sud">Sud</option>
            <option value="Sud-Ouest">Sud-Ouest</option>
        </select>

        </div>

        {/* Bouton de réinitialisation rapide */}
        {(selectedStatus !== 'Tous' || selectedRegion !== 'Toutes' || searchTerm !== '') && (
        <button
            onClick={() => { setSelectedStatus('Tous'); setSelectedRegion('Toutes'); setSearchTerm(''); }}
            className="text-xs text-red-600 hover:text-red-800 font-medium underline"
        >
            Réinitialiser les filtres
        </button>
        )}
    </div>

      {/* États de chargement et d'erreurs */}
    {loading && (
        <div className="flex justify-center items-center py-12 text-blue-600 font-medium">
        <span className="animate-pulse">Filtrage des données en cours...</span>
        </div>
    )}

    {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
        ⚠️ {error}
        </div>
    )}

      {/* Le Tableau mis à jour */}
    {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Citoyen</th>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-6">Région</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRequests.length === 0 ? (
                <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                    Aucune demande ne correspond à vos critères de filtrage.
                    </td>
                </tr>
                ) : (
                filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-gray-700">#{req.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{req.citizen_name || req.user}</td>
                    <td className="py-4 px-6 text-gray-600">{req.service_type || req.title}</td>
                    <td className="py-4 px-6 text-gray-500">{req.region || "Non spécifiée"}</td>
                    <td className="py-4 px-6 text-gray-500">
                        {req.created_at ? new Date(req.created_at).toLocaleDateString('fr-FR') : "Date inconnue"}
                    </td>
                    <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'Approuvé' || req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        req.status === 'En attente' || req.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                        }`}>
                        {req.status}
                        </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                        <button className="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                        Gérer
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    )}
    </div>
);
}
