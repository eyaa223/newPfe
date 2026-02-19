import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600">
            Une question ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <FaMapMarkerAlt className="text-3xl text-primary-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Adresse</h3>
              <p className="text-gray-600">
                123 Rue de la Charité<br />
                75001 Paris, France
              </p>
            </div>

            <div className="card">
              <FaPhone className="text-3xl text-primary-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Téléphone</h3>
              <p className="text-gray-600">+33 1 23 45 67 89</p>
            </div>

            <div className="card">
              <FaEnvelope className="text-3xl text-primary-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-gray-600">contact@charitable.fr</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      className="input-field pl-10"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      className="input-field pl-10"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="input-field"
                    placeholder="Sujet de votre message"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    className="input-field"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <FaPaperPlane />
                  <span>{sending ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
