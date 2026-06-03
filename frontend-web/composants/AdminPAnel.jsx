import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Search, Check, X, FileText, MapPin } from 'lucide-react';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterRegion, setFilterRegion] = useState('Toutes');
  const [searchTerm, setSearchTerm] = useState('');

  const regions = ['Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'];

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/my-requests/');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données admin:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/my-requests/${id}/`, { status: newStatus });
      fetchAdminData(); // Recharger la liste après modification
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // Logique de filtrage dynamique
  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'Tous' || req.status === filterStatus;
    const matchesRegion = filterRegion === 'Toutes' || req.region === filterRegion;
    const matchesSearch = req.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (req.description && req.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesRegion && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Suivi des Demandes Administratives
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panneau d'administration global de Camerservices</p>
        </div>
        <button 
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Validé">Validé</option>
            <option value="Rejeté">Rejeté</option>
          </select>

          <select 
            value={filterRegion} 
            onChange={(e) => setFilterRegion(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="Toutes">Toutes les régions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Tableau des Demandes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucune demande ne correspond à vos critères.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold border-b border-gray-100">
                  <th className="p-4 pl-6">Service</th>
                  <th className="p-4">Région</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-gray-900">{req.service_name}</div>
                      {req.description && <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{req.description}</p>}
                    </td>
                    <td className="p-4 text-gray-500 inline-flex items-center gap-1 mt-2">
                      <MapPin size={14} /> {req.region}
                    </td>
                    <td className="p-4 text-gray-500">{new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        req.status === 'Validé' ? 'bg-green-100 text-green-800' :
                        req.status === 'Rejeté' ? 'bg-red-100 text-red-800' :
                        req.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Validé')}
                          className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                          title="Valider la demande"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Rejeté')}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Rejeter la demande"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;