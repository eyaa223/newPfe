const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Association = require('./models/Association');
const Campaign = require('./models/Campaign');

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Association.deleteMany({});
    await Campaign.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@charitable.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      phone: '+33123456789'
    });
    console.log('✅ Admin user created');

    // Create regular users
    const users = await User.insertMany([
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        password: 'password123',
        role: 'user',
        phone: '+33612345678',
        address: {
          city: 'Paris',
          country: 'France'
        }
      },
      {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        password: 'password123',
        role: 'user',
        phone: '+33623456789',
        address: {
          city: 'Lyon',
          country: 'France'
        }
      }
    ]);
    console.log('✅ Regular users created');

    // Create associations
    const associations = await Association.insertMany([
      {
        name: 'Croix-Rouge Française',
        description: 'Organisation humanitaire internationale qui aide les personnes en situation de vulnérabilité.',
        email: 'contact@croixrouge.fr',
        phone: '+33145473030',
        address: {
          street: '98 Rue Didot',
          city: 'Paris',
          postalCode: '75014',
          country: 'France'
        },
        registrationNumber: 'RNA-W751000001',
        categories: ['health', 'poverty', 'children'],
        isVerified: true,
        isActive: true
      },
      {
        name: 'Restos du Cœur',
        description: 'Association luttant contre la précarité et l\'exclusion par l\'aide alimentaire et l\'insertion.',
        email: 'contact@restosducoeur.org',
        phone: '+33153329010',
        address: {
          street: '45 Rue Pixérécourt',
          city: 'Paris',
          postalCode: '75020',
          country: 'France'
        },
        registrationNumber: 'RNA-W751000002',
        categories: ['poverty', 'children'],
        isVerified: true,
        isActive: true
      },
      {
        name: 'WWF France',
        description: 'Organisation mondiale de protection de la nature et de l\'environnement.',
        email: 'info@wwf.fr',
        phone: '+33155251070',
        address: {
          street: '35-37 Rue Baudin',
          city: 'Montreuil',
          postalCode: '93100',
          country: 'France'
        },
        registrationNumber: 'RNA-W751000003',
        categories: ['environment', 'animals'],
        isVerified: true,
        isActive: true
      },
      {
        name: 'SOS Villages d\'Enfants',
        description: 'Accueil de frères et sœurs séparés de leurs parents dans un cadre familial.',
        email: 'contact@sosve.org',
        phone: '+33144108550',
        address: {
          street: '4 Cité Monthiers',
          city: 'Paris',
          postalCode: '75009',
          country: 'France'
        },
        registrationNumber: 'RNA-W751000004',
        categories: ['children', 'education'],
        isVerified: true,
        isActive: true
      }
    ]);
    console.log('✅ Associations created');

    // Create association users
    const assocUsers = [];
    for (let i = 0; i < associations.length; i++) {
      const assocUser = await User.create({
        firstName: 'Responsable',
        lastName: associations[i].name.split(' ')[0],
        email: `admin@${associations[i].name.toLowerCase().replace(/\s+/g, '')}.org`,
        password: 'password123',
        role: 'association',
        phone: associations[i].phone,
        associationId: associations[i]._id,
        isVerified: true
      });
      
      // Update association with admin user
      associations[i].adminUsers.push(assocUser._id);
      await associations[i].save();
      
      assocUsers.push(assocUser);
    }
    console.log('✅ Association users created');

    // Create campaigns
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);

    await Campaign.insertMany([
      {
        title: 'Urgence Humanitaire - Aide aux Réfugiés',
        description: 'Apportez votre soutien aux familles réfugiées en leur fournissant nourriture, vêtements et abri. Chaque don compte pour améliorer leurs conditions de vie.',
        association: associations[0]._id,
        category: 'poverty',
        goalAmount: 50000,
        currentAmount: 32000,
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        endDate: futureDate,
        status: 'active',
        isUrgent: true,
        location: { city: 'Paris', country: 'France' },
        beneficiariesCount: 150,
        donationsCount: 245
      },
      {
        title: 'Distribution Alimentaire - Hiver 2026',
        description: 'Campagne hivernale pour distribuer des repas chauds et des colis alimentaires aux personnes sans-abri et familles dans le besoin.',
        association: associations[1]._id,
        category: 'poverty',
        goalAmount: 75000,
        currentAmount: 48000,
        startDate: new Date(today.getFullYear(), today.getMonth() - 1, 15),
        endDate: futureDate,
        status: 'active',
        isUrgent: true,
        location: { city: 'Multiple', country: 'France' },
        beneficiariesCount: 500,
        donationsCount: 380
      },
      {
        title: 'Sauvegarde des Océans',
        description: 'Programme de protection des écosystèmes marins et de lutte contre la pollution plastique. Agissons ensemble pour préserver nos océans.',
        association: associations[2]._id,
        category: 'environment',
        goalAmount: 100000,
        currentAmount: 65000,
        startDate: new Date(today.getFullYear(), 0, 1),
        endDate: new Date(today.getFullYear(), 11, 31),
        status: 'active',
        isUrgent: false,
        location: { city: 'National', country: 'France' },
        beneficiariesCount: 0,
        donationsCount: 520
      },
      {
        title: 'Éducation pour Tous',
        description: 'Offrez à des enfants défavorisés l\'accès à l\'éducation avec fournitures scolaires, soutien scolaire et activités périscolaires.',
        association: associations[3]._id,
        category: 'education',
        goalAmount: 40000,
        currentAmount: 28500,
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth() + 3, 1),
        status: 'active',
        isUrgent: false,
        location: { city: 'Paris', country: 'France' },
        beneficiariesCount: 85,
        donationsCount: 195
      },
      {
        title: 'Soins Médicaux d\'Urgence',
        description: 'Financez des soins médicaux essentiels pour les populations vulnérables sans accès aux soins de santé.',
        association: associations[0]._id,
        category: 'health',
        goalAmount: 60000,
        currentAmount: 15000,
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth() + 4, 1),
        status: 'active',
        isUrgent: true,
        location: { city: 'National', country: 'France' },
        beneficiariesCount: 200,
        donationsCount: 125
      }
    ]);
    console.log('✅ Campaigns created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@charitable.com / admin123');
    console.log('User: jean.dupont@email.com / password123');
    console.log('Association: admin@croixrougefrançaise.org / password123');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
