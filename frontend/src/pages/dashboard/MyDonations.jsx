import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/api';
import { FaHeart, FaCalendar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationService.getUserDonations(user.id);
      setDonations(response.data.donations || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mes Dons</h1>
        <p className="text-gray-600">Historique de vos contributions caritatives</p>
      </div>

      {donations.length === 0 ? (
        <div className="card text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun don pour le moment</h3>
          <p className="text-gray-600 mb-6">
            Commencez à soutenir les causes qui vous tiennent à cœur
          </p>
          <Link to="/campaigns" className="btn-primary inline-block">
            Découvrir les Campagnes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation._id} className="card hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {donation.campaign?.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                    <FaCalendar />
                    <span>{new Date(donation.donationDate).toLocaleDateString()}</span>
                  </div>
                  {donation.association && (
                    <p className="text-sm text-gray-600">
                      Association: {donation.association.name}
                    </p>
                  )}
                  {donation.message && (
                    <p className="text-sm text-gray-700 mt-2 italic">
                      "{donation.message}"
                    </p>
                  )}
                  <div className="mt-2">
                    <span className={`badge ${
                      donation.paymentStatus === 'completed' ? 'badge-success' :
                      donation.paymentStatus === 'pending' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {donation.paymentStatus === 'completed' ? 'Complété' :
                       donation.paymentStatus === 'pending' ? 'En attente' :
                       'Échoué'}
                    </span>
                    {donation.isAnonymous && (
                      <span className="badge badge-info ml-2">Anonyme</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {donation.amount} €
                  </div>
                  <div className="text-sm text-gray-600">{donation.paymentMethod}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
