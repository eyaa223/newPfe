import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { associationService, campaignService } from '../../services/api';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaGlobe } from 'react-icons/fa';

const AssociationDetail = () => {
  const { id } = useParams();
  const [association, setAssociation] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssociationDetails();
  }, [id]);

  const fetchAssociationDetails = async () => {
    try {
      const [assocRes, campaignsRes] = await Promise.all([
        associationService.getById(id),
        campaignService.getAll({ association: id })
      ]);
      setAssociation(assocRes.data.association);
      setCampaigns(campaignsRes.data.campaigns || []);
    } catch (error) {
      console.error('Error fetching association:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Association non trouvée</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {association.logo ? (
                <img
                  src={association.logo}
                  alt={association.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaCheckCircle className="text-4xl text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{association.name}</h1>
                {association.isVerified && (
                  <FaCheckCircle className="text-primary-600 text-xl" title="Association vérifiée" />
                )}
              </div>
              <p className="text-gray-700 mb-4">{association.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {association.email && (
                  <div className="flex items-center space-x-1">
                    <FaEnvelope />
                    <span>{association.email}</span>
                  </div>
                )}
                {association.phone && (
                  <div className="flex items-center space-x-1">
                    <FaPhone />
                    <span>{association.phone}</span>
                  </div>
                )}
                {association.address && (
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>
                      {association.address.city}, {association.address.country}
                    </span>
                  </div>
                )}
                {association.website && (
                  <div className="flex items-center space-x-1">
                    <FaGlobe />
                    <a
                      href={association.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {association.totalCampaigns}
            </div>
            <div className="text-gray-600">Campagnes</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {association.totalDonations?.toLocaleString()} €
            </div>
            <div className="text-gray-600">Dons collectés</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <div className="text-gray-600">Campagnes actives</div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campagnes de l'association</h2>
          {campaigns.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucune campagne pour le moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <a
                  key={campaign._id}
                  href={`/campaigns/${campaign._id}`}
                  className="block p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary-600">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">
                      {campaign.currentAmount?.toLocaleString()} €
                    </span>
                    <span className="text-gray-600">
                      / {campaign.goalAmount?.toLocaleString()} €
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssociationDetail;
