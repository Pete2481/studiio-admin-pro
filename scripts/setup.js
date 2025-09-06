#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Studiio Multi-Tenant RBAC System...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database (PostgreSQL required)
DATABASE_URL="postgresql://username:password@localhost:5432/studiio"

# NextAuth
NEXTAUTH_URL="http://localhost:5173"
NEXTAUTH_SECRET="${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}"

# Email Provider (SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@studiio.com"

# App Configuration
NODE_ENV="development"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
  console.log('⚠️  Please update the DATABASE_URL and email settings in .env.local\n');
} else {
  console.log('✅ .env.local already exists\n');
}

console.log('📋 Next steps:');
console.log('1. Update DATABASE_URL in .env.local with your PostgreSQL connection string');
console.log('2. Configure email settings in .env.local');
console.log('3. Run: npm run db:generate');
console.log('4. Run: npm run db:push');
console.log('5. Run: npm run db:seed');
console.log('6. Run: npm run dev');
console.log('\n🎉 Setup complete!');
