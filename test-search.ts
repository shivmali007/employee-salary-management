import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSearch() {
  const name = 'Aaliyah Barrows';
  console.log(`Searching for: ${name}`);

  const employees = await prisma.employee.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });

  console.log(`Found ${employees.length} employees.`);
  if (employees.length > 0) {
    console.log('First match:', employees[0]);
  }
}

checkSearch()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
