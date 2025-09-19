import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  console.log('🌱 Seeding reconciliation data...');

  // Get or create a tenant
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Demo Studio',
        slug: 'demo-studio',
        domain: 'demo.studiio.com',
        isActive: true,
      },
    });
  }

  // Get or create a user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@studiio.com',
      },
    });
  }

  // Create user-tenant relationship
  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: user.id,
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'MASTER_ADMIN',
    },
  });

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.findFirst({
      where: { name: 'Luxury Real Estate Co', tenantId: tenant.id },
    }).then(existing => existing || prisma.company.create({
      data: {
        name: 'Luxury Real Estate Co',
        type: 'Luxury Real Estate',
        phone: '+61 2 9123 4567',
        email: 'info@luxuryrealestate.com',
        isActive: true,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.company.findFirst({
      where: { name: 'Premium Properties', tenantId: tenant.id },
    }).then(existing => existing || prisma.company.create({
      data: {
        name: 'Premium Properties',
        type: 'Real Estate',
        phone: '+61 2 9876 5432',
        email: 'contact@premiumproperties.com',
        isActive: true,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
  ]);

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.findFirst({
      where: { email: 'john.doe@example.com', tenantId: tenant.id },
    }).then(existing => existing || prisma.client.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+61 400 123 456',
        companyId: companies[0].id,
        isActive: true,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.client.findFirst({
      where: { email: 'jane.smith@example.com', tenantId: tenant.id },
    }).then(existing => existing || prisma.client.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+61 400 654 321',
        companyId: companies[1].id,
        isActive: true,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.client.findFirst({
      where: { email: 'bob.johnson@example.com', tenantId: tenant.id },
    }).then(existing => existing || prisma.client.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '+61 400 789 012',
        companyId: companies[0].id,
        isActive: true,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
  ]);

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.findFirst({
      where: { invoiceNumber: 'INV-001', tenantId: tenant.id },
    }).then(existing => existing || prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-001',
        amountCents: 150000, // $1,500.00
        status: 'SENT',
        dueDate: new Date('2024-01-15'),
        clientId: clients[0].id,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.invoice.findFirst({
      where: { invoiceNumber: 'INV-002', tenantId: tenant.id },
    }).then(existing => existing || prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-002',
        amountCents: 250000, // $2,500.00
        status: 'SENT',
        dueDate: new Date('2024-01-20'),
        clientId: clients[1].id,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.invoice.findFirst({
      where: { invoiceNumber: 'INV-003', tenantId: tenant.id },
    }).then(existing => existing || prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-003',
        amountCents: 100000, // $1,000.00
        status: 'SENT',
        dueDate: new Date('2024-01-10'),
        clientId: clients[2].id,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.invoice.findFirst({
      where: { invoiceNumber: 'INV-004', tenantId: tenant.id },
    }).then(existing => existing || prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-004',
        amountCents: 75000, // $750.00
        status: 'DRAFT',
        dueDate: new Date('2024-02-01'),
        clientId: clients[0].id,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
    prisma.invoice.findFirst({
      where: { invoiceNumber: 'INV-005', tenantId: tenant.id },
    }).then(existing => existing || prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-005',
        amountCents: 300000, // $3,000.00
        status: 'OVERDUE',
        dueDate: new Date('2023-12-15'),
        clientId: clients[1].id,
        tenantId: tenant.id,
        createdBy: user.id,
      },
    })),
  ]);

  // Create sample payments (these would normally come from CSV upload)
  // Temporarily disabled - Payment model not yet implemented
  const payments: any[] = [];

  console.log('✅ Reconciliation seed data created:');
  console.log(`   - ${companies.length} companies`);
  console.log(`   - ${clients.length} clients`);
  console.log(`   - ${invoices.length} invoices`);
  console.log(`   - ${payments.length} payments`);
  console.log('');
  console.log('📋 Sample CSV data for testing:');
  console.log('Date,Amount,Reference,BankTxnId');
  console.log('16/01/2024,1500.00,INV-001 Payment,BNK123456');
  console.log('21/01/2024,2500.00,Payment for invoice 002,BNK123457');
  console.log('25/01/2024,500.00,Partial payment INV-002,BNK123458');
  console.log('30/01/2024,750.00,INV-004 Photography Services,BNK123459');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding reconciliation data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
