import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService, associationService } from '../services/api';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaArrowRight, FaFire } from 'react-icons/fa';
import '../../src/index.css';
const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, associationsRes] = await Promise.all([
        campaignService.getAll({ status: 'active', limit: 6 }),
        associationService.getAll({ isVerified: true, limit: 6 })
      ]);
      
      setFeaturedCampaigns(campaignsRes.data.campaigns || []);
      setAssociations(associationsRes.data.associations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ensemble, Créons un Monde Meilleur
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Plateforme numérique dédiée à la gestion des actions caritatives.
              Soutenez les associations, faites des dons et aidez ceux qui en ont besoin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/campaigns" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Découvrir les Campagnes
              </Link>
              <Link to="/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Rejoignez-nous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <FaHandHoldingHeart className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Campagnes Actives</p>
            </div>
            <div className="p-6">
              <FaUsers className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">200+</h3>
              <p className="text-gray-600">Associations Vérifiées</p>
            </div>
            <div className="p-6">
              <FaHeart className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Personnes Aidées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Campagnes en Vedette</h2>
            <Link to="/campaigns" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <span>Voir tout</span>
              <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCampaigns.slice(0, 6).map((campaign) => (
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
      </section>

      {/* Associations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Associations Partenaires</h2>
            <Link to="/associations" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <span>Voir tout</span>
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {associations.slice(0, 6).map((association) => (
              <Link
                key={association._id}
                to={`/associations/${association._id}`}
                className="card text-center hover:shadow-xl transition group"
              >
                <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
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
                <h3 className="text-sm font-semibold group-hover:text-primary-600 transition line-clamp-2">
                  {association.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à faire la différence ?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Rejoignez notre communauté et participez aux actions caritatives qui changent des vies.
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Commencer Maintenant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
