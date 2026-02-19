import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaHeart className="text-primary-500 text-2xl" />
              <span className="text-xl font-bold text-white">Plateforme Caritative</span>
            </div>
            <p className="text-sm mb-4">
              Ensemble, nous facilitons la gestion des actions caritatives et créons un impact positif dans nos communautés.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-500 transition">Accueil</Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-primary-500 transition">Campagnes</Link>
              </li>
              <li>
                <Link to="/associations" className="hover:text-primary-500 transition">Associations</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition">À propos</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-primary-500 transition">Centre d'aide</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-500 transition">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-500 transition">Conditions d'utilisation</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-primary-500 mt-1" />
                <span className="text-sm">123 Rue de la Charité, 75001 Paris, France</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-primary-500" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-primary-500" />
                <span className="text-sm">contact@charitable.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Plateforme Caritative. Tous droits réservés.
          </p>
          <p className="text-xs mt-2">
            Développé avec <FaHeart className="inline text-red-500" /> pour un monde meilleur
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
