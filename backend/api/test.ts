import { prisma } from './src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  try {
    const admin = await prisma.admin.findFirst();
    const isMatch = await bcrypt.compare('Admin@123', admin.passwordHash);
    console.log('Password match:', isMatch);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
