import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking agents in database...');

  // Get all agents
  const agents = await prisma.agent.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  console.log(`📊 Found ${agents.length} agents:`);
  agents.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.role})`);
    console.log(`    Company: ${agent.company?.name} (${agent.companyId})`);
    console.log(`    Tenant: ${agent.tenant?.name} (${agent.tenant?.slug})`);
    console.log(`    Email: ${agent.email}`);
    console.log('');
  });

  // Get all tenants
  const tenants = await prisma.tenant.findMany();
  console.log(`🏢 Available tenants:`);
  tenants.forEach(tenant => {
    console.log(`  - ${tenant.name} (${tenant.slug}) - ID: ${tenant.id}`);
  });

  // Get all companies
  const companies = await prisma.company.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
  console.log(`\n🏢 Available companies:`);
  companies.forEach(company => {
    console.log(`  - ${company.name} (${company.id})`);
    console.log(`    Tenant: ${company.tenant?.name} (${company.tenant?.slug})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error checking agents:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
