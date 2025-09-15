import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Completing Mediadrive setup with agents, photographers, and bookings...');

  // Get the tenant and existing data
  const tenant = await prisma.tenant.findUnique({
    where: { slug: 'business-media-drive' }
  });

  const masterAdmin = await prisma.user.findUnique({
    where: { email: 'admin@studiio.com' }
  });

  const companies = await prisma.company.findMany({
    where: { tenantId: tenant.id },
    include: { clients: true }
  });

  const services = await prisma.service.findMany({
    where: { tenantId: tenant.id }
  });

  const bookingStatuses = await prisma.bookingStatus.findMany({
    where: { tenantId: tenant.id }
  });

  console.log('👥 Adding agents to companies...');
  
  // Add agents to each company
  for (const company of companies) {
    const agents = [
      {
        name: `${company.name.split(' ')[0]} Senior Agent`,
        email: `senior@${company.name.toLowerCase().replace(/\s+/g, '')}.com.au`,
        phone: '+61 400 123 456',
        role: 'Senior Real Estate Agent',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        companyId: company.id,
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      },
      {
        name: `${company.name.split(' ')[0]} Property Specialist`,
        email: `specialist@${company.name.toLowerCase().replace(/\s+/g, '')}.com.au`,
        phone: '+61 400 123 457',
        role: 'Luxury Property Specialist',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        companyId: company.id,
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      }
    ];

    for (const agentData of agents) {
      const existingAgent = await prisma.agent.findFirst({
        where: {
          email: agentData.email,
          tenantId: tenant.id
        }
      });

      if (!existingAgent) {
        await prisma.agent.create({ data: agentData });
        console.log(`  ✅ Added ${agentData.name} to ${company.name}`);
      }
    }
  }

  console.log('\n📸 Adding photographers...');
  
  // Add photographers
  const photographers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@mediadrive.com.au',
      phone: '+61 400 555 001',
      role: 'Lead Photographer',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      tenantId: tenant.id,
      createdBy: masterAdmin.id,
    },
    {
      name: 'Mike Chen',
      email: 'mike@mediadrive.com.au',
      phone: '+61 400 555 002',
      role: 'Senior Photographer',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      tenantId: tenant.id,
      createdBy: masterAdmin.id,
    }
  ];

  for (const photographerData of photographers) {
    const existingPhotographer = await prisma.photographer.findFirst({
      where: {
        email: photographerData.email,
        tenantId: tenant.id
      }
    });

    if (!existingPhotographer) {
      await prisma.photographer.create({ data: photographerData });
      console.log(`  ✅ Added photographer ${photographerData.name}`);
    }
  }

  console.log('\n📅 Creating sample bookings...');
  
  const tentativeStatus = bookingStatuses.find(s => s.name === 'Tentative');
  const confirmedStatus = bookingStatuses.find(s => s.name === 'Confirmed');

  // Create sample bookings for each client
  for (const company of companies) {
    if (company.clients.length > 0) {
      const client = company.clients[0];
      const agent = await prisma.agent.findFirst({
        where: { companyId: company.id }
      });
      
      const photographer = await prisma.photographer.findFirst({
        where: { tenantId: tenant.id }
      });

      const service = services[0]; // Property Photography

      const bookingData = {
        title: `${client.name} - Property Photography`,
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        status: tentativeStatus.name,
        clientId: client.id,
        agentId: agent?.id,
        photographerId: photographer?.id,
        address: client.address || `${company.name} Property`,
        notes: `Photography session for ${client.name} at ${company.name}`,
        durationM: service.durationMinutes,
        services: JSON.stringify([service.id]),
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      };

      await prisma.booking.create({ data: bookingData });
      console.log(`  ✅ Created booking for ${client.name}`);
    }
  }

  console.log('\n🎉 Complete Mediadrive setup finished!');
}

main()
  .catch((e) => {
    console.error('❌ Error completing Mediadrive setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
