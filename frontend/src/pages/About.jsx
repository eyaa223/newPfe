import React from 'react';
import { FaHeart, FaHandsHelping, FaUsers, FaLightbulb } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">À propos de nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme innovante dédiée à la transformation des actions caritatives
          </p>
        </div>

        {/* Mission */}
        <div className="card max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Notre plateforme a été créée avec une vision claire : faciliter et moderniser la gestion
            des actions caritatives en France et dans le monde. Nous croyons fermement que la technologie
            peut être un catalyseur puissant pour le bien social.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            En connectant les associations caritatives, les donateurs et les bénéficiaires sur une
            plateforme sécurisée et transparente, nous visons à maximiser l'impact de chaque contribution
            et à créer une communauté solidaire engagée.
          </p>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <FaHeart className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Solidarité</h3>
              <p className="text-gray-600">
                Nous croyons en la force de l'entraide et de la compassion
              </p>
            </div>
            <div className="card text-center">
              <FaHandsHelping className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Transparence</h3>
              <p className="text-gray-600">
                Nous garantissons une visibilité totale sur l'utilisation des dons
              </p>
            </div>
            <div className="card text-center">
              <FaUsers className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-gray-600">
                Nous créons des liens durables entre tous les acteurs
              </p>
            </div>
            <div className="card text-center">
              <FaLightbulb className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Nous utilisons la technologie pour amplifier l'impact social
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos Fonctionnalités</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gestion des campagnes</h3>
                <p className="text-gray-600">
                  Créez et gérez facilement vos campagnes de collecte de fonds
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dons sécurisés</h3>
                <p className="text-gray-600">
                  Système de paiement sécurisé avec suivi en temps réel
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-lg">Demandes d'aide</h3>
                <p className="text-gray-600">
                  Les bénéficiaires peuvent soumettre leurs demandes d'assistance
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-lg">Statistiques détaillées</h3>
                <p className="text-gray-600">
                  Tableaux de bord complets pour suivre l'impact de vos actions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
