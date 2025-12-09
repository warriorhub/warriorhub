/* eslint-disable no-await-in-loop */
import { PrismaClient, Role, EventSize, Category } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // Store created users by email
  const createdUsers: { [email: string]: number } = {};

  // Create users (use for...of for proper async handling)
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });

    createdUsers[account.email] = user.id;
  }

  // Create categories
  for (const categoryNew of config.defaultCategories) {
    console.log(`  Adding category: ${categoryNew.name}`);

    await prisma.categoryNew.upsert({
      where: { name: categoryNew.name },
      update: {},
      create: {
        name: categoryNew.name,
      },
    });
  }
  // Create events (need a user with ORGANIZER role)
  if (config.defaultEvents) {
    // Find first ORGANIZER user or use first user
    const organizerAccount = config.defaultAccounts.find(acc => acc.role === 'ORGANIZER');
    const organizerId = organizerAccount
      ? createdUsers[organizerAccount.email]
      : Object.values(createdUsers)[0];

    if (!organizerId) {
      console.log('  No users found to create events');
      return;
    }

    for (const event of config.defaultEvents) {
      const eventSize = (event.eventSize as EventSize) || null;
      const categories = (event.categories as Category[]) || [];

      console.log(`  Adding event: ${event.name}`);

      // Use create() - let database auto-generate UUID
      await prisma.event.create({
        data: {
          name: event.name,
          description: event.description,
          dateTime: event.dateTime,
          location: event.location,
          eventSize,
          categories,
          categoriesNew: {
            connect:
              event.categoriesNew,
          },
          createdById: organizerId, // Link to organizer user
        },
      });
    }
  }

  console.log('Seeding completed!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
