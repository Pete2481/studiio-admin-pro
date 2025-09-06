import { PrismaClient } from '@prisma/client';
import { generateToken } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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

  // Create sample tenants
  const tenant1 = await prisma.tenant.upsert({
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

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'photo-studio' },
    update: {},
    create: {
      name: 'Photo Studio',
      slug: 'photo-studio',
      domain: 'photostudio.com',
      primaryColor: '#7C3AED',
      secondaryColor: '#8B5CF6',
    },
  });

  // Create user-tenant relationships
  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: masterAdmin.id, tenantId: tenant1.id } },
    update: {},
    create: {
      userId: masterAdmin.id,
      tenantId: tenant1.id,
      role: 'MASTER_ADMIN',
    },
  });

  await prisma.userTenant.upsert({
    where: { userId_tenantId: { userId: masterAdmin.id, tenantId: tenant2.id } },
    update: {},
    create: {
      userId: masterAdmin.id,
      tenantId: tenant2.id,
      role: 'MASTER_ADMIN',
    },
  });

  // Create sample companies - CLEARED FOR NEW DATA
  // const company1 = await prisma.company.upsert({
  //   where: { id: 'company-1' },
  //   update: {},
  //   create: {
  //     id: 'company-1',
  //     name: "Sotheby's International Realty",
  //     type: 'Luxury Real Estate',
  //     phone: '+1-555-0123',
  //     email: 'info@sothebys.com',
  //     invoiceEmails: JSON.stringify(['billing@sothebys.com', 'accounts@sothebys.com']),
  //     logoUrl: '/logos/sothebys.png',
  //     isActive: true,
  //     propertiesCount: 156,
  //     clientsCount: 2847,
  //     salesVolume: '$1.2B',
  //     permissions: JSON.stringify([
  //       'View Calendar',
  //       'View Blanked out Bookings', 
  //       'View Invoice',
  //       'View Service'
  //     ]),
  //     sendWelcomeEmail: false,
  //     tenantId: tenant1.id,
  //     createdBy: masterAdmin.id,
  //   },
  // });

  // const company2 = await prisma.company.upsert({
  //   where: { id: 'company-2' },
  //   update: {},
  //   create: {
  //     id: 'company-2',
  //     name: 'Century 21 Real Estate',
  //     type: 'Residential Real Estate',
  //     phone: '+1-555-0456',
  //     email: 'info@century21.com',
  //     invoiceEmails: JSON.stringify(['billing@century21.com']),
  //     logoUrl: '/logos/century21.png',
  //     isActive: true,
  //     propertiesCount: 89,
  //     clientsCount: 1247,
  //     salesVolume: '$850M',
  //     permissions: JSON.stringify([
  //       'View Calendar',
  //       'View Invoice'
  //     ]),
  //     sendWelcomeEmail: true,
  //     tenantId: tenant1.id,
  //     createdBy: masterAdmin.id,
  //   },
  // });

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      name: 'Real Estate Agency',
      email: 'contact@realestate.com',
      phone: '+1234567890',
      // companyId: company1.id, // Commented out since companies are cleared
      address: '123 Main St, City',
      tenantId: tenant1.id,
      createdBy: masterAdmin.id,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      name: 'Wedding Couple',
      email: 'wedding@example.com',
      phone: '+1234567891',
      // companyId: company2.id, // Commented out since companies are cleared
      address: '456 Wedding Ave, City',
      tenantId: tenant1.id,
      createdBy: masterAdmin.id,
    },
  });

  // Create sample users - CLEARED FOR NEW DATA
  // const photographer = await prisma.user.upsert({
  //   where: { email: 'photographer@studiio-pro.com' },
  //   update: {},
  //   create: {
  //     email: 'photographer@studiio-pro.com',
  //     name: 'John Photographer',
  //     emailVerified: new Date(),
  //   },
  // });

  // const editor = await prisma.user.upsert({
  //   where: { email: 'editor@studiio-pro.com' },
  //   update: {},
  //   create: {
  //     email: 'editor@studiio-pro.com',
  //     name: 'Sarah Editor',
  //     emailVerified: new Date(),
  //   },
  // });

  // const client = await prisma.user.upsert({
  //   where: { email: 'client@studiio-pro.com' },
  //   update: {},
  //   create: {
  //     email: 'client@studiio-pro.com',
  //     name: 'Mike Client',
  //     emailVerified: new Date(),
  //   },
  // });

  // // Assign roles to users
  // await prisma.userTenant.createMany({
  //   data: [
  //     {
  //       userId: photographer.id,
  //       tenantId: tenant1.id,
  //       role: 'PHOTOGRAPHER',
  //     },
  //     {
  //       userId: editor.id,
  //       tenantId: tenant1.id,
  //       role: 'EDITOR',
  //     },
  //     {
  //       userId: client.id,
  //       tenantId: tenant1.id,
  //       role: 'CLIENT',
  //     },
  //   ],
  // });

  // Create sample services
  await prisma.service.createMany({
    data: [
      {
        name: 'SUNRISE SHOOT',
        description: 'Capture your project in its most serene and flattering light. Our sunrise sessions take advantage of the soft, golden hour lighting to showcase your property at its absolute best.',
        icon: '🌅',
        price: 300.00,
        durationMinutes: 90,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 25,
        displayPrice: true,
        favorite: true,
        status: 'Active',
      },
      {
        name: 'UPDATE FLOOR PLAN',
        description: 'Professional floor plan updates and modifications for existing properties.',
        icon: '🏠',
        price: 50.00,
        durationMinutes: 30,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: false,
        imageQuota: 0,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'STUDIO PACKAGE',
        description: '• Up to 15 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour',
        icon: '📸',
        price: 425.00,
        durationMinutes: 120,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 15,
        displayPrice: true,
        favorite: true,
        status: 'Active',
      },
      {
        name: 'ESSENTIAL PACKAGE',
        description: '• Up to 35 Images • Branded Floor Plan & Site Plan • Drone Photography • AI Decluttering $10 (Per Image) • Professional Editing • Virtual Tour',
        icon: '📷',
        price: 550.00,
        durationMinutes: 180,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 35,
        displayPrice: true,
        favorite: true,
        status: 'Active',
      },
      {
        name: 'BASIC VIDEO PACKAGE',
        description: '• Up to 20 Images • 45-60 sec Walkthrough Video (Basic edit - no agent or voiceover) • Branded Floor Plan & Site Plan • Drone Photography',
        icon: '🎬',
        price: 850.00,
        durationMinutes: 240,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 20,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'PREMIUM PACKAGE (VIDEO PACKAGE)',
        description: '• Up to 50 Images • Branded Floor Plan & Site Plan • Drone Photography • 1-2min Cinematic Property Tour • AI Decluttering $10 (Per Image) • Professional Editing',
        icon: '🎥',
        price: 1100.00,
        durationMinutes: 300,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 50,
        displayPrice: true,
        favorite: true,
        status: 'Active',
      },
      {
        name: 'RENTAL PACKAGE',
        description: 'Our RENTAL PACKAGE includes up to 15 high-quality images, a branded floor plan, and stunning drone photography to showcase your rental property effectively.',
        icon: '🏘️',
        price: 285.00,
        durationMinutes: 90,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 15,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'STUDIO PHOTOGRAPHY (RENTAL)',
        description: 'Our STUDIO PHOTOGRAPHY (RENTAL) package includes 10 high-quality images, capturing your rental property in the best possible light.',
        icon: '📸',
        price: 225.00,
        durationMinutes: 60,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 10,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'ESSENTIAL PHOTOGRAPHY',
        description: 'Our ESSENTIAL PHOTOGRAPHY package delivers up to 20 high-quality ground images, capturing the property from all angles with professional equipment.',
        icon: '📷',
        price: 350.00,
        durationMinutes: 120,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 20,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'DUSK PHOTOGRAPHY',
        description: 'DUSK PHOTOGRAPHY captures stunning twilight visuals with 10 high-quality images, taken from ground level to showcase your property in beautiful evening light.',
        icon: '🌆',
        price: 245.00,
        durationMinutes: 60,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 10,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'FLOOR PLAN',
        description: 'Our FLOOR PLAN service provides a detailed and accurate layout of the property, helping buyers visualize the space and flow of your property.',
        icon: '📐',
        price: 195.00,
        durationMinutes: 45,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: false,
        imageQuota: 0,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
      {
        name: 'AERIAL DRONE PHOTOGRAPHY',
        description: 'Our AERIAL DRONE PHOTOGRAPHY package delivers stunning high-angle shots with up to 10 high-quality drone images showcasing your property from above.',
        icon: '🚁',
        price: 225.00,
        durationMinutes: 60,
        isActive: true,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
        imageQuotaEnabled: true,
        imageQuota: 10,
        displayPrice: true,
        favorite: false,
        status: 'Active',
      },
    ],
  });

  // Create sample bookings
  await prisma.booking.createMany({
    data: [
      {
        title: 'Property Photography',
        start: new Date('2024-01-15T10:00:00Z'),
        end: new Date('2024-01-15T12:00:00Z'),
        status: 'CONFIRMED',
        clientId: client1.id,
        address: '123 Main St, City',
        durationM: 120,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
      },
      {
        title: 'Wedding Photography',
        start: new Date('2024-01-20T14:00:00Z'),
        end: new Date('2024-01-20T18:00:00Z'),
        status: 'TENTATIVE',
        clientId: client2.id,
        address: '456 Wedding Ave, City',
        durationM: 240,
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
      },
    ],
  });

  // Create sample galleries
  const gallery1 = await prisma.gallery.create({
    data: {
      title: 'Property Gallery',
      description: 'Beautiful property photography',
      publicId: generateToken(16),
      isPublic: true,
      tenantId: tenant1.id,
      createdBy: masterAdmin.id,
    },
  });

  // Create sample gallery images
  await prisma.galleryImage.createMany({
    data: [
      {
        galleryId: gallery1.id,
        storageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        type: 'image',
        alt: 'Property exterior',
        order: 1,
      },
      {
        galleryId: gallery1.id,
        storageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        type: 'image',
        alt: 'Property interior',
        order: 2,
      },
    ],
  });

  // Create sample invoices
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-001',
        amountCents: 29900,
        status: 'SENT',
        dueDate: new Date('2024-02-15'),
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
      },
      {
        invoiceNumber: 'INV-002',
        amountCents: 49900,
        status: 'DRAFT',
        tenantId: tenant1.id,
        createdBy: masterAdmin.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Master admin email: admin@studiio.com');
  console.log('🔑 Use magic link authentication to sign in');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
