import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaHeart, FaBullhorn, FaUsers, FaCheckCircle } from 'react-icons/fa';

const DashboardHome = ({ stats }) => {
  const { user, isAdmin, isAssociation, isUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, {user?.firstName} !
        </h1>
        <p className="text-gray-600">
          {isUser && "Voici un aperçu de vos contributions."}
          {isAssociation && "Gérez vos campagnes et suivez vos dons."}
          {isAdmin && "Gérez la plateforme et supervisez les activités."}
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isUser && (
            <>
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <FaHeart className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
                <div className="text-blue-100">Dons effectués</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <FaChartLine className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalDonationAmount?.toLocaleString()} €</div>
                <div className="text-green-100">Montant total</div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <FaBullhorn className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.campaignsSupported}</div>
                <div className="text-purple-100">Campagnes soutenues</div>
              </div>
              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FaCheckCircle className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <div className="text-orange-100">Demandes</div>
              </div>
            </>
          )}

          {isAssociation && (
            <>
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <FaBullhorn className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                <div className="text-blue-100">Campagnes</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <FaHeart className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalDonations}</div>
                <div className="text-green-100">Dons reçus</div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <FaChartLine className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalDonationAmount?.toLocaleString()} €</div>
                <div className="text-purple-100">Montant collecté</div>
              </div>
              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FaUsers className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.beneficiariesHelped}</div>
                <div className="text-orange-100">Bénéficiaires</div>
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <FaUsers className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-blue-100">Utilisateurs</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <FaBullhorn className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalAssociations}</div>
                <div className="text-green-100">Associations</div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <FaChartLine className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                <div className="text-purple-100">Campagnes</div>
              </div>
              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <FaHeart className="text-3xl mb-2" />
                <div className="text-2xl font-bold">{stats.totalDonationAmount?.toLocaleString()} €</div>
                <div className="text-orange-100">Dons totaux</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
        <p className="text-gray-600">
          Consultez les sections appropriées dans le menu pour voir les détails de vos activités.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
