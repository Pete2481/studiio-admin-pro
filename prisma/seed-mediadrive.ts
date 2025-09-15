import { PrismaClient } from '@prisma/client';
import { generateToken } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Mediadrive-only database seed...');

  // Create master admin user
  const masterAdmin = await prisma.user.upsert({
    where: { email: 'admin@studiio.com' },
    update: {},
    create: {
      email: 'admin@studiio.com',
      name: 'Master Admin',
      emailVerified: new Date(),
    },
  });

  // Create ONLY the business-media-drive tenant
  const mediadriveTenant = await prisma.tenant.upsert({
    where: { slug: 'business-media-drive' },
    update: {},
    create: {
      name: 'Business Media Drive',
      slug: 'business-media-drive',
      domain: 'mediadrive.com.au',
      primaryColor: '#0D9488',
      secondaryColor: '#14B8A6',
    },
  });

  console.log(`✅ Created/Updated tenant: ${mediadriveTenant.name} (${mediadriveTenant.slug})`);

  // Create user-tenant relationship for master admin
  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: masterAdmin.id, tenantId: mediadriveTenant.id } },
    update: {},
    create: {
      userId: masterAdmin.id,
      tenantId: mediadriveTenant.id,
      role: 'MASTER_ADMIN',
    },
  });

  // Create tenant settings
  await prisma.tenantSettings.upsert({
    where: { tenantId: mediadriveTenant.id },
    update: {},
    create: {
      tenantId: mediadriveTenant.id,
      businessHours: JSON.stringify({
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '14:00', closed: false },
        sunday: { closed: true }
      }),
      notificationSettings: JSON.stringify({
        emailNotifications: true,
        smsNotifications: false,
        bookingReminders: true,
        invoiceAlerts: true
      }),
      brandingSettings: JSON.stringify({
        logoUrl: 'https://mediadrive.com.au/logo.png',
        primaryColor: '#0D9488',
        secondaryColor: '#14B8A6'
      })
    },
  });

  // Create sample companies for Mediadrive
  const companies = [
    {
      name: 'Luxury Real Estate Group',
      type: 'Luxury Real Estate',
      phone: '+61 2 9876 5432',
      email: 'info@luxuryrealestate.com.au',
      invoiceEmails: JSON.stringify(['billing@luxuryrealestate.com.au', 'accounts@luxuryrealestate.com.au']),
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
      salesVolume: '$2.5B',
      propertiesCount: 150,
      clientsCount: 45,
    },
    {
      name: 'Premium Properties Co',
      type: 'Premium Real Estate',
      phone: '+61 2 8765 4321',
      email: 'contact@premiumproperties.com.au',
      invoiceEmails: JSON.stringify(['invoices@premiumproperties.com.au']),
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
      salesVolume: '$1.8B',
      propertiesCount: 120,
      clientsCount: 38,
    },
    {
      name: 'Elite Realty Solutions',
      type: 'Elite Real Estate',
      phone: '+61 2 7654 3210',
      email: 'hello@eliterealty.com.au',
      invoiceEmails: JSON.stringify(['billing@eliterealty.com.au']),
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
      salesVolume: '$3.2B',
      propertiesCount: 200,
      clientsCount: 62,
    }
  ];

  const createdCompanies = [];
  for (const companyData of companies) {
    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: companyData.name,
        tenantId: mediadriveTenant.id
      }
    });

    if (!existingCompany) {
      const company = await prisma.company.create({
        data: {
          ...companyData,
          tenantId: mediadriveTenant.id,
          createdBy: masterAdmin.id,
        },
      });
      createdCompanies.push(company);
    } else {
      createdCompanies.push(existingCompany);
    }
  }

  console.log(`✅ Created/Updated ${createdCompanies.length} companies`);

  // Create sample clients
  const clients = [
    {
      name: 'John & Sarah Thompson',
      email: 'john.sarah@email.com',
      phone: '+61 412 345 678',
      companyId: createdCompanies[0].id,
      address: '123 Harbour View, Sydney NSW 2000',
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+61 423 456 789',
      companyId: createdCompanies[1].id,
      address: '456 Ocean Drive, Bondi NSW 2026',
    },
    {
      name: 'Emma & David Wilson',
      email: 'emma.david@email.com',
      phone: '+61 434 567 890',
      companyId: createdCompanies[2].id,
      address: '789 Mountain View, Blue Mountains NSW 2780',
    }
  ];

  const createdClients = [];
  for (const clientData of clients) {
    // Check if client already exists
    const existingClient = await prisma.client.findFirst({
      where: {
        email: clientData.email,
        tenantId: mediadriveTenant.id
      }
    });

    if (!existingClient) {
      const client = await prisma.client.create({
        data: {
          ...clientData,
          tenantId: mediadriveTenant.id,
          createdBy: masterAdmin.id,
        },
      });
      createdClients.push(client);
    } else {
      createdClients.push(existingClient);
    }
  }

  console.log(`✅ Created/Updated ${createdClients.length} clients`);

  // Create sample services
  const services = [
    {
      name: 'Property Photography',
      description: 'Professional property photography service',
      icon: '📸',
      price: 450.00,
      durationMinutes: 120,
      imageQuotaEnabled: true,
      imageQuota: 50,
      favorite: true,
    },
    {
      name: 'Virtual Tour',
      description: '360-degree virtual tour creation',
      icon: '🏠',
      price: 650.00,
      durationMinutes: 180,
      imageQuotaEnabled: true,
      imageQuota: 100,
      favorite: true,
    },
    {
      name: 'Drone Photography',
      description: 'Aerial photography and videography',
      icon: '🚁',
      price: 750.00,
      durationMinutes: 150,
      imageQuotaEnabled: true,
      imageQuota: 30,
      favorite: false,
    },
    {
      name: 'Video Walkthrough',
      description: 'Professional video walkthrough of property',
      icon: '🎥',
      price: 850.00,
      durationMinutes: 240,
      imageQuotaEnabled: true,
      imageQuota: 1,
      favorite: false,
    }
  ];

  const createdServices = [];
  for (const serviceData of services) {
    // Check if service already exists
    const existingService = await prisma.service.findFirst({
      where: {
        name: serviceData.name,
        tenantId: mediadriveTenant.id
      }
    });

    if (!existingService) {
      const service = await prisma.service.create({
        data: {
          ...serviceData,
          tenantId: mediadriveTenant.id,
          createdBy: masterAdmin.id,
        },
      });
      createdServices.push(service);
    } else {
      createdServices.push(existingService);
    }
  }

  console.log(`✅ Created/Updated ${createdServices.length} services`);

  // Create booking statuses
  const bookingStatuses = [
    { name: 'Tentative', color: '#F59E0B', isDefault: true, order: 1 },
    { name: 'Confirmed', color: '#10B981', isDefault: false, order: 2 },
    { name: 'In Progress', color: '#3B82F6', isDefault: false, order: 3 },
    { name: 'Completed', color: '#6B7280', isDefault: false, order: 4 },
    { name: 'Cancelled', color: '#EF4444', isDefault: false, order: 5 },
  ];

  const createdStatuses = [];
  for (const statusData of bookingStatuses) {
    // Check if status already exists
    const existingStatus = await prisma.bookingStatus.findFirst({
      where: {
        name: statusData.name,
        tenantId: mediadriveTenant.id
      }
    });

    if (!existingStatus) {
      const status = await prisma.bookingStatus.create({
        data: {
          ...statusData,
          tenantId: mediadriveTenant.id,
          createdBy: masterAdmin.id,
        },
      });
      createdStatuses.push(status);
    } else {
      createdStatuses.push(existingStatus);
    }
  }

  console.log(`✅ Created/Updated ${createdStatuses.length} booking statuses`);

  console.log('🎉 Mediadrive-only database seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`  - Tenant: ${mediadriveTenant.name} (${mediadriveTenant.slug})`);
  console.log(`  - Companies: ${createdCompanies.length}`);
  console.log(`  - Clients: ${createdClients.length}`);
  console.log(`  - Services: ${createdServices.length}`);
  console.log(`  - Booking Statuses: ${createdStatuses.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Mediadrive database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
