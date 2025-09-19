import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  console.log('👥 Seeding agents...');

  // Get the master admin user
  const masterAdmin = await prisma.user.findUnique({
    where: { email: 'admin@studiio.com' }
  });

  if (!masterAdmin) {
    console.error('❌ Master admin not found. Please run the main seed first.');
    return;
  }

  // Get the Business Media Drive tenant
  const tenant = await prisma.tenant.findUnique({
    where: { slug: 'business-media-drive' }
  });

  if (!tenant) {
    console.error('❌ Business Media Drive tenant not found. Please run the main seed first.');
    return;
  }

  // Get companies
  const companies = await prisma.company.findMany({
    where: { tenantId: tenant.id }
  });

  if (companies.length === 0) {
    console.error('❌ No companies found. Please run the real estate seed first.');
    return;
  }

  console.log(`📊 Found ${companies.length} companies`);

  // Create agents for each company
  const agents = [];

  for (const company of companies) {
    const companyAgents = [
      {
        name: `John Smith`,
        email: `john.smith@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1234567890',
        role: 'Senior Real Estate Agent',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        companyId: company.id,
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      },
      {
        name: `Sarah Johnson`,
        email: `sarah.johnson@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1234567891',
        role: 'Luxury Property Specialist',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        companyId: company.id,
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      },
      {
        name: `Mike Wilson`,
        email: `mike.wilson@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+1234567892',
        role: 'Property Consultant',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        companyId: company.id,
        tenantId: tenant.id,
        createdBy: masterAdmin.id,
      }
    ];

    for (const agentData of companyAgents) {
      // Check if agent already exists
      const existingAgent = await prisma.agent.findFirst({
        where: {
          email: agentData.email,
          tenantId: tenant.id
        }
      });

      if (!existingAgent) {
        const agent = await prisma.agent.create({
          data: agentData,
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        agents.push(agent);
      } else {
        console.log(`⚠️  Agent ${agentData.name} already exists, skipping...`);
      }
    }
  }

  console.log(`✅ Created ${agents.length} agents across ${companies.length} companies`);
  console.log('📊 Agents created:');
  agents.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.role}) at ${agent.company?.name}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding agents:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
