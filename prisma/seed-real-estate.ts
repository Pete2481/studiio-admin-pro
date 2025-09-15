import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏢 Seeding Real Estate clients...');

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

  // Create business admin user
  const businessAdmin = await prisma.user.upsert({
    where: { email: 'business@studiio.com' },
    update: {},
    create: {
      email: 'business@studiio.com',
      name: 'Business Admin',
      emailVerified: new Date(),
    },
  });

  // Create Studiio Pro tenant
  const studiioProTenant = await prisma.tenant.upsert({
    where: { slug: 'studiio-pro' },
    update: {},
    create: {
      name: 'Studiio Pro',
      slug: 'studiio-pro',
      domain: 'studiio-pro.com',
      primaryColor: '#0D9488',
      secondaryColor: '#14B8A6',
    },
  });

  // Create user-tenant relationships
  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: masterAdmin.id, tenantId: studiioProTenant.id } },
    update: {},
    create: {
      userId: masterAdmin.id,
      tenantId: studiioProTenant.id,
      role: 'MASTER_ADMIN',
    },
  });

  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: businessAdmin.id, tenantId: studiioProTenant.id } },
    update: {},
    create: {
      userId: businessAdmin.id,
      tenantId: studiioProTenant.id,
      role: 'SUB_ADMIN',
    },
  });

  // Create the 3 Real Estate Companies
  const sothebysCompany = await prisma.company.upsert({
    where: { id: 'sothebys-company' },
    update: {},
    create: {
      id: 'sothebys-company',
      name: 'Sotheby\'s International Realty',
      type: 'Luxury Real Estate',
      email: 'contact@sothebys.com',
      phone: '+1234567890',
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
      salesVolume: '$2.5B',
      propertiesCount: 150,
      clientsCount: 45,
    },
  });

  const raineHorneCompany = await prisma.company.upsert({
    where: { id: 'raine-horne-company' },
    update: {},
    create: {
      id: 'raine-horne-company',
      name: 'Raine and Horne Real Estate',
      type: 'Established Real Estate',
      email: 'info@rainehorne.com',
      phone: '+1234567891',
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
      salesVolume: '$1.8B',
      propertiesCount: 120,
      clientsCount: 38,
    },
  });

  const bellePropertyCompany = await prisma.company.upsert({
    where: { id: 'belle-property-company' },
    update: {},
    create: {
      id: 'belle-property-company',
      name: 'Belle Property Group',
      type: 'Luxury Property Group',
      email: 'contact@belleproperty.com',
      phone: '+1234567892',
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
      salesVolume: '$1.2B',
      propertiesCount: 85,
      clientsCount: 32,
    },
  });

  // Create the 3 Real Estate Client Users
  const sothebysClient = await prisma.user.upsert({
    where: { email: 'client@sothebys.com' },
    update: {},
    create: {
      email: 'client@sothebys.com',
      name: 'Sotheby\'s International Realty',
      emailVerified: new Date(),
    },
  });

  const raineHorneClient = await prisma.user.upsert({
    where: { email: 'client@rainehorne.com' },
    update: {},
    create: {
      email: 'client@rainehorne.com',
      name: 'Raine and Horne Real Estate',
      emailVerified: new Date(),
    },
  });

  const bellePropertyClient = await prisma.user.upsert({
    where: { email: 'client@belleproperty.com' },
    update: {},
    create: {
      email: 'client@belleproperty.com',
      name: 'Belle Property Group',
      emailVerified: new Date(),
    },
  });

  // Create user-tenant relationships for clients
  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: sothebysClient.id, tenantId: studiioProTenant.id } },
    update: {},
    create: {
      userId: sothebysClient.id,
      tenantId: studiioProTenant.id,
      role: 'CLIENT',
    },
  });

  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: raineHorneClient.id, tenantId: studiioProTenant.id } },
    update: {},
    create: {
      userId: raineHorneClient.id,
      tenantId: studiioProTenant.id,
      role: 'CLIENT',
    },
  });

  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: bellePropertyClient.id, tenantId: studiioProTenant.id } },
    update: {},
    create: {
      userId: bellePropertyClient.id,
      tenantId: studiioProTenant.id,
      role: 'CLIENT',
    },
  });

  // Create Client records
  await prisma.client.upsert({
    where: { id: 'sothebys-client' },
    update: {},
    create: {
      id: 'sothebys-client',
      name: 'Sotheby\'s International Realty',
      email: 'contact@sothebys.com',
      phone: '+1234567890',
      companyId: sothebysCompany.id,
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
    },
  });

  await prisma.client.upsert({
    where: { id: 'raine-horne-client' },
    update: {},
    create: {
      id: 'raine-horne-client',
      name: 'Raine and Horne Real Estate',
      email: 'info@rainehorne.com',
      phone: '+1234567891',
      companyId: raineHorneCompany.id,
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
    },
  });

  await prisma.client.upsert({
    where: { id: 'belle-property-client' },
    update: {},
    create: {
      id: 'belle-property-client',
      name: 'Belle Property Group',
      email: 'contact@belleproperty.com',
      phone: '+1234567892',
      companyId: bellePropertyCompany.id,
      tenantId: studiioProTenant.id,
      createdBy: businessAdmin.id,
    },
  });

  console.log('✅ Real Estate clients seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 1 Master Admin');
  console.log('  - 1 Business Admin');
  console.log('  - 1 Tenant (Studiio Pro)');
  console.log('  - 3 Companies');
  console.log('  - 3 Client Users');
  console.log('  - 3 Client Records');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
