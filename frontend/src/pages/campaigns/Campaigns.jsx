import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/api';
import { FaSearch, FaFilter, FaHeart, FaFire } from 'react-icons/fa';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'active',
    isUrgent: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAll(filters);
      setCampaigns(response.data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'education', label: 'Éducation' },
    { value: 'health', label: 'Santé' },
    { value: 'poverty', label: 'Pauvreté' },
    { value: 'environment', label: 'Environnement' },
    { value: 'children', label: 'Enfants' },
    { value: 'elderly', label: 'Personnes âgées' },
    { value: 'animals', label: 'Animaux' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campagnes Caritatives</h1>
          <p className="text-gray-600">
            Soutenez les causes qui vous tiennent à cœur
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent"
                checked={filters.isUrgent === 'true'}
                onChange={(e) => setFilters({ ...filters, isUrgent: e.target.checked ? 'true' : '' })}
                className="w-4 h-4"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                Urgences uniquement
              </label>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune campagne trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link
                key={campaign._id}
                to={`/campaigns/${campaign._id}`}
                className="card hover:shadow-xl transition group"
              >
                {campaign.isUrgent && (
                  <div className="flex items-center space-x-1 text-red-600 mb-2">
                    <FaFire />
                    <span className="text-sm font-semibold">URGENT</span>
                  </div>
                )}
                <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {campaign.images && campaign.images[0] ? (
                    <img
                      src={campaign.images[0]}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaHeart className="text-6xl text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>
                {campaign.association && (
                  <p className="text-sm text-gray-500 mb-4">
                    Par {campaign.association.name}
                  </p>
                )}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Collecté</span>
                    <span>{Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">
                    {campaign.currentAmount?.toLocaleString()} €
                  </span>
                  <span className="text-gray-600">
                    sur {campaign.goalAmount?.toLocaleString()} €
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
