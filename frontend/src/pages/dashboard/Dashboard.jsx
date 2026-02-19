import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsService } from '../../services/api';
import { FaTachometerAlt, FaHeart, FaHandHoldingHeart, FaBullhorn, FaUsers, FaChartLine } from 'react-icons/fa';

// Dashboard components
import DashboardHome from './DashboardHome';
import MyDonations from './MyDonations';
import MyCampaigns from './MyCampaigns';
import MyRequests from './MyRequests';

const Dashboard = () => {
  const { user, isAdmin, isAssociation, isUser } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsService.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Accueil', icon: FaTachometerAlt, roles: ['user', 'association', 'admin'] },
    { path: '/dashboard/donations', label: 'Mes Dons', icon: FaHeart, roles: ['user'] },
    { path: '/dashboard/campaigns', label: 'Campagnes', icon: FaBullhorn, roles: ['association', 'admin'] },
    { path: '/dashboard/requests', label: 'Demandes d\'aide', icon: FaHandHoldingHeart, roles: ['user', 'association', 'admin'] },
    { path: '/dashboard/users', label: 'Utilisateurs', icon: FaUsers, roles: ['admin'] },
    { path: '/dashboard/statistics', label: 'Statistiques', icon: FaChartLine, roles: ['association', 'admin'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
              
              <nav className="space-y-1">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              {stats && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistiques Rapides</h4>
                  {isUser && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dons effectués</span>
                        <span className="font-semibold">{stats.totalDonations}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Montant total</span>
                        <span className="font-semibold">{stats.totalDonationAmount?.toLocaleString()} €</span>
                      </div>
                    </>
                  )}
                  {isAssociation && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Campagnes</span>
                        <span className="font-semibold">{stats.totalCampaigns}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dons reçus</span>
                        <span className="font-semibold">{stats.totalDonationAmount?.toLocaleString()} €</span>
                      </div>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Utilisateurs</span>
                        <span className="font-semibold">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Associations</span>
                        <span className="font-semibold">{stats.totalAssociations}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<DashboardHome stats={stats} />} />
              <Route path="/donations" element={<MyDonations />} />
              <Route path="/campaigns" element={<MyCampaigns />} />
              <Route path="/requests" element={<MyRequests />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
