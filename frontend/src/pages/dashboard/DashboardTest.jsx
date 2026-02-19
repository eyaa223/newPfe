import React from 'react';
import { Link } from 'react-router-dom';

// VERSION TEST SIMPLE DU DASHBOARD
// Pour vérifier si Tailwind fonctionne

const DashboardTest = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TEST 1 : Styles inline (devraient TOUJOURS fonctionner) */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            🔍 Test du Dashboard - Diagnostic CSS
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Si vous voyez ce texte stylisé avec une carte blanche, les styles INLINE fonctionnent.
          </p>
        </div>

        {/* TEST 2 : Classes Tailwind (doivent fonctionner si Tailwind est actif) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Test des Classes Tailwind
          </h2>
          <p className="text-gray-600 mb-4">
            Si ce texte est stylisé correctement, Tailwind CSS fonctionne !
          </p>
          
          {/* Boutons de test */}
          <div className="flex gap-4 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Bouton Bleu
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              Bouton Vert
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition">
              Bouton Rouge
            </button>
          </div>
        </div>

        {/* TEST 3 : Classes personnalisées du fichier index.css */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Test des Classes Personnalisées
          </h2>
          <p className="text-gray-600 mb-4">
            Si cette carte a une ombre et des coins arrondis, la classe .card fonctionne !
          </p>
          
          <div className="flex gap-4 flex-wrap mb-4">
            <button className="btn-primary">
              Bouton Primary
            </button>
            <button className="btn-secondary">
              Bouton Secondary
            </button>
            <button className="btn-outline">
              Bouton Outline
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <span className="badge badge-success">Succès</span>
            <span className="badge badge-warning">Attention</span>
            <span className="badge badge-danger">Erreur</span>
            <span className="badge badge-info">Info</span>
          </div>
        </div>

        {/* TEST 4 : Layout responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Card 1</h3>
            <p className="text-gray-600">Layout responsive avec grid</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-green-600 mb-2">Card 2</h3>
            <p className="text-gray-600">Devrait être en 2 colonnes sur tablette</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-purple-600 mb-2">Card 3</h3>
            <p className="text-gray-600">Et 3 colonnes sur desktop</p>
          </div>
        </div>

        {/* Résultats du diagnostic */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            📊 Résultats du Diagnostic
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ Si les styles INLINE fonctionnent → Navigateur OK</li>
            <li>✅ Si les classes TAILWIND fonctionnent → Tailwind compilé</li>
            <li>✅ Si les classes PERSONNALISÉES fonctionnent → index.css chargé</li>
            <li>✅ Si le layout RESPONSIVE fonctionne → Configuration complète OK</li>
          </ul>
        </div>

        {/* Liens de navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            ← Retour à l'accueil
          </Link>
          <Link 
            to="/dashboard" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Dashboard Normal
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🛠️ Que faire si le CSS ne fonctionne pas ?
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Ouvrez la console du navigateur (F12)</li>
            <li>Vérifiez les erreurs dans l'onglet "Console"</li>
            <li>Vérifiez que index.css est chargé (onglet "Network")</li>
            <li>Videz le cache : Ctrl + Shift + R</li>
            <li>Exécutez : <code className="bg-gray-100 px-2 py-1 rounded">fix-css-dashboard.bat</code></li>
            <li>Redémarrez le serveur frontend</li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default DashboardTest;
