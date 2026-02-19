import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService, donationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaCalendar, FaMapMarkerAlt, FaUsers, FaFire } from 'react-icons/fa';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const [campaignRes, donationsRes] = await Promise.all([
        campaignService.getById(id),
        donationService.getCampaignDonations(id)
      ]);
      setCampaign(campaignRes.data.campaign);
      setDonations(donationsRes.data.donations || []);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Erreur lors du chargement de la campagne');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour faire un don');
      navigate('/login');
      return;
    }

    if (!donationAmount || donationAmount < 1) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    setProcessing(true);
    try {
      await donationService.create({
        campaign: id,
        amount: parseFloat(donationAmount),
        paymentMethod: 'credit_card',
        message: donationMessage,
        isAnonymous
      });
      
      toast.success('Merci pour votre don !');
      setDonationAmount('');
      setDonationMessage('');
      fetchCampaignDetails();
    } catch (error) {
      toast.error('Erreur lors du don');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Campagne non trouvée</h2>
      </div>
    );
  }

  const progress = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              {campaign.isUrgent && (
                <div className="flex items-center space-x-2 text-red-600 mb-4">
                  <FaFire className="text-xl" />
                  <span className="font-bold">CAMPAGNE URGENTE</span>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              
              {campaign.images && campaign.images[0] && (
                <img
                  src={campaign.images[0]}
                  alt={campaign.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                {campaign.location && (
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>{campaign.location.city}, {campaign.location.country}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <FaUsers />
                  <span>{campaign.beneficiariesCount} bénéficiaires</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaCalendar />
                  <span>
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
              </div>

              {campaign.association && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Association</h3>
                  <div className="flex items-center space-x-3">
                    {campaign.association.logo && (
                      <img
                        src={campaign.association.logo}
                        alt={campaign.association.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{campaign.association.name}</p>
                      <p className="text-sm text-gray-600">{campaign.association.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Donations */}
            <div className="card mt-6">
              <h3 className="text-xl font-semibold mb-4">Derniers dons</h3>
              {donations.length === 0 ? (
                <p className="text-gray-600">Aucun don pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {donations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">
                          {donation.donor.firstName} {donation.donor.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-primary-600">
                        {donation.amount} €
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {campaign.currentAmount?.toLocaleString()} €
                  </span>
                  <span className="text-gray-600">
                    collectés sur {campaign.goalAmount?.toLocaleString()} €
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">{progress}% de l'objectif atteint</p>
              </div>

              <div className="mb-6 text-center">
                <p className="text-lg font-semibold">{campaign.donationsCount} donateurs</p>
              </div>

              {campaign.status === 'active' && (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant du don (€)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="input-field"
                      placeholder="50"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      className="input-field"
                      rows="3"
                      placeholder="Votre message de soutien..."
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 mr-2"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Don anonyme
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <FaHeart />
                    <span>{processing ? 'Traitement...' : 'Faire un don'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
