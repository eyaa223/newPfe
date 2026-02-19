import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { associationService } from '../../services/api';
import { FaSearch, FaUsers, FaCheckCircle } from 'react-icons/fa';

const Associations = () => {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAssociations();
  }, [search]);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await associationService.getAll({ search, isVerified: true });
      setAssociations(response.data.associations || []);
    } catch (error) {
      console.error('Error fetching associations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Associations Partenaires</h1>
          <p className="text-gray-600">
            Découvrez les associations vérifiées qui œuvrent pour un monde meilleur
          </p>
        </div>

        {/* Search */}
        <div className="card mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une association..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Associations Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : associations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune association trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associations.map((association) => (
              <Link
                key={association._id}
                to={`/associations/${association._id}`}
                className="card hover:shadow-xl transition group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {association.logo ? (
                      <img
                        src={association.logo}
                        alt={association.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUsers className="text-3xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary-600 transition">
                        {association.name}
                      </h3>
                      {association.isVerified && (
                        <FaCheckCircle className="text-primary-600" title="Vérifié" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {association.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                  <span className="text-gray-600">
                    {association.totalCampaigns} campagnes
                  </span>
                  <span className="font-semibold text-primary-600">
                    {association.totalDonations?.toLocaleString()} € collectés
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

export default Associations;
