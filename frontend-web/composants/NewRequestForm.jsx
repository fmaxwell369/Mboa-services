import React, { useState } from 'react';
import axios from 'axios';

const NewRequestForm = ({ onFormSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    region: '',
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  // Liste des régions pour le menu déroulant
const regions = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
];

  // Liste des services administratifs disponibles
const services = [
    { id: 'naissance', name: 'Acte de naissance' },
    { id: 'nationalite', name: 'Certificat de nationalité' },
    { id: 'mariage', name: 'Copie d\'acte de mariage' },
    { id: 'residence', name: 'Certificat de résidence' }
];

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Envoi de la demande au backend Django
      // Modifie l'URL si ton endpoint de création est différent
    await axios.post('http://localhost:8000/api/my-requests/', {
        service_name: formData.service_type, // On envoie le nom du service choisi
        region: formData.region,
        description: formData.description,
        status: 'En attente' // Statut initial par défaut
    });

    setLoading(false);
      if (onFormSuccess) onFormSuccess(); // Permet de rafraîchir le dashboard et de fermer le formulaire
    } catch (err) {
    console.error("Erreur lors de la soumission de la demande :", err);
    setError("Impossible d'envoyer la demande. Vérifiez la connexion avec le serveur.");
    setLoading(false);
    }
};

return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle demande de document administratif</h2>
    
    {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
        {error}
        </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Choix du service */}
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de document demandé *
        </label>
        <select
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 text-gray-800"
        >
            <option value="">-- Sélectionnez un document --</option>
            {Object.keys(servicesConfig).map((serviceName) => (
            <option key={serviceName} value={serviceName}>
                {servicesConfig[serviceName].displayName}
            </option>
            ))}
        </select>
        </div>

        {/* Choix de la région */}
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Région d'origine / d'émission *
        </label>
        <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 text-gray-800"
        >
            <option value="">-- Sélectionnez votre région --</option>
            {regions.map((reg) => (
            <option key={reg} value={reg}>
                {reg}
            </option>
            ))}
        </select>
        </div>

        {/* Précisions / Description */}
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Détails ou précisions supplémentaires
        </label>
        <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Ex: Date de naissance, nom complet des parents si nécessaire, ou toute information utile pour traiter votre dossier..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 text-gray-800"
        ></textarea>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
            Annuler
        </button>
        <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors disabled:opacity-50"
        >
            {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
        </button>
        </div>
    </form>
    </div>
);
};

export default NewRequestForm;