import "dotenv/config";

import bcrypt from "bcrypt";

import { prisma } from "../src/config/prisma.js";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

async function bootstrapAdmin(): Promise<void> {
  if (process.env.BOOTSTRAP_ADMIN_CONFIRM !== "CREATE_SUPERADMIN") {
    throw new Error(
      "Set BOOTSTRAP_ADMIN_CONFIRM=CREATE_SUPERADMIN to confirm this one-time operation",
    );
  }

  const email = requiredEnv("BOOTSTRAP_ADMIN_EMAIL").toLowerCase();
  const fullName = requiredEnv("BOOTSTRAP_ADMIN_FULL_NAME");
  const password = requiredEnv("BOOTSTRAP_ADMIN_PASSWORD");

  if (password.length < 16) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD must contain at least 16 characters");
  }

  const existingSuperAdmin = await prisma.admin.findFirst({
    where: { role: "SUPERADMIN" },
    select: { email: true },
  });

  if (existingSuperAdmin) {
    throw new Error(
      `A SUPERADMIN already exists (${existingSuperAdmin.email}); refusing to create another one`,
    );
  }

  const existingEmail = await prisma.admin.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingEmail) {
    throw new Error(`An admin with email ${email} already exists`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: "SUPERADMIN",
    },
    select: { id: true, email: true },
  });

  console.info(`Created SUPERADMIN ${admin.email} (${admin.id})`);
}

bootstrapAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`SUPERADMIN bootstrap failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
