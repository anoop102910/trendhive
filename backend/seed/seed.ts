import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function deleteAllData() {
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
}

async function seedData() {
  console.info('Deleting all data');

  try {
    await deleteAllData();
    console.info('Deleting all data completed');
  } catch (error) {
    console.error('Error deleting all data', error);
    // You might want to handle this error more gracefully, e.g., by exiting the process.
    return;
  }

  console.info('Seeding users');

  const userData = await Promise.all(
    Array.from({ length: 1000 }).map(async () => ({
      email: faker.internet.email(),
      password: await bcrypt.hash('testTest@123', 10),
      name: faker.person.fullName(),
      isEmailVerified: true,
      avatar: faker.image.avatar(),
    })),
  );

  const anoopUser = await prisma.user.create({
    data: {
      email: 'anoop@gmail.com',
      password: await bcrypt.hash('testTest@123', 10),
      name: 'Anoop',
      isEmailVerified: true,
      avatar: faker.image.avatar(),
    },
  });

  const usersCount = (await prisma.user.createMany({ data: userData })).count;

  console.info(`Seeded ${usersCount + 1} users`);

  const categoriesData = await Promise.all(
    Array.from({ length: 100 }).map(async () => ({
      name: faker.commerce.productName(),
      slug: faker.lorem.slug(),
      description: faker.commerce.productDescription(),
      metadata: {
        key: faker.commerce.productName(),
        value: faker.commerce.productDescription(),
      },
      seoSlug: faker.lorem.slug(),
      seoTitle: faker.commerce.productName(),
      seoDescription: faker.commerce.productDescription(),
    })),
  );

  const categoriesCount = (
    await prisma.category.createMany({ data: categoriesData })
  ).count;

  console.info(`Seeded ${categoriesCount} categories`);
}

seedData()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seeding completed');
  })
  .catch(async (error) => {
    console.error('Seeding failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
