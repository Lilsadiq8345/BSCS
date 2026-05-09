import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@codeserver.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('✅ Admin user created: admin@codeserver.com / admin123');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  // Create a sample project
  const sampleProject = await prisma.project.upsert({
    where: { id: 'sample-project-id' },
    update: {},
    create: {
      id: 'sample-project-id',
      name: 'Alpha Project',
      description: 'The primary secure development workspace.',
      hostPath: './projects/alpha',
    },
  });
  console.log('✅ Sample project created: Alpha Project');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
