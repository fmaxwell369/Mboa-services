import React, { useState } from 'react';
import CitizenDashboard from '../composants/citizenDashboard.jsx';
import AdminPanel from '../composants/AdminPAnel.jsx';

function App() {
const [role, setRole] = useState('citizen');

return (
    <div className="min-h-screen bg-gray-100 font-sans">
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
        <span className="font-bold text-lg tracking-wide">Camerservices</span>
        <div className="flex gap-4">
        <button
            onClick={() => setRole('citizen')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${role === 'citizen' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
        >
            Espace Citoyen
        </button>
        <button
            onClick={() => setRole('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${role === 'admin' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-slate-700'}`}
        >
            Espace Admin
        </button>
        </div>
    </nav>

    <main className="py-6">
        {role === 'citizen' ? (
        <CitizenDashboard />
        ) : (
          /* AFFICHAGE DU COMPOSANT ADMIN STYLISÉ */
        <AdminPanel />
        )}
    </main>
    </div>
);
}

export default App;