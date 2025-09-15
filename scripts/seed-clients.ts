import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedClients() {
  try {
    console.log('🌱 Seeding clients...');

    // Get the first tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.log('❌ No tenant found. Please run tenant seeding first.');
      return;
    }

    // Get the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found. Please run user seeding first.');
      return;
    }

    // Create some companies first
    const companies = await Promise.all([
      prisma.company.upsert({
        where: { id: 'company-1' },
        update: {},
        create: {
          id: 'company-1',
          name: 'Sotheby\'s International Realty',
          type: 'Luxury Real Estate',
          phone: '+1-555-0101',
          email: 'contact@sothebys.com',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.company.upsert({
        where: { id: 'company-2' },
        update: {},
        create: {
          id: 'company-2',
          name: 'Raine and Horne Real Estate',
          type: 'Real Estate',
          phone: '+1-555-0102',
          email: 'info@rainehorne.com',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.company.upsert({
        where: { id: 'company-3' },
        update: {},
        create: {
          id: 'company-3',
          name: 'Belle Property Group',
          type: 'Real Estate',
          phone: '+1-555-0103',
          email: 'contact@belleproperty.com',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
    ]);

    console.log('✅ Created companies:', companies.map(c => c.name));

    // Create clients
    const clients = await Promise.all([
      prisma.client.upsert({
        where: { id: 'sothebys-client' },
        update: {},
        create: {
          id: 'sothebys-client',
          name: 'Sotheby\'s International Realty',
          email: 'contact@sothebys.com',
          phone: '+1-555-0101',
          companyId: 'company-1',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.client.upsert({
        where: { id: 'raine-horne-client' },
        update: {},
        create: {
          id: 'raine-horne-client',
          name: 'Raine and Horne Real Estate',
          email: 'info@rainehorne.com',
          phone: '+1-555-0102',
          companyId: 'company-2',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.client.upsert({
        where: { id: 'belle-property-client' },
        update: {},
        create: {
          id: 'belle-property-client',
          name: 'Belle Property Group',
          email: 'contact@belleproperty.com',
          phone: '+1-555-0103',
          companyId: 'company-3',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.client.upsert({
        where: { id: 'luxury-homes-client' },
        update: {},
        create: {
          id: 'luxury-homes-client',
          name: 'Luxury Homes Realty',
          email: 'info@luxuryhomes.com',
          phone: '+1-555-0104',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
      prisma.client.upsert({
        where: { id: 'premier-properties-client' },
        update: {},
        create: {
          id: 'premier-properties-client',
          name: 'Premier Properties',
          email: 'contact@premierproperties.com',
          phone: '+1-555-0105',
          tenantId: tenant.id,
          createdBy: user.id,
        },
      }),
    ]);

    console.log(`✅ Created ${clients.length} clients:`);
    clients.forEach(client => {
      console.log(`   - ${client.name} (${client.email})`);
    });

  } catch (error) {
    console.error('❌ Error seeding clients:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedClients();



