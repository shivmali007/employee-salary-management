import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding 10,000 employees...');

  const countries = [
    { name: 'USA', currency: 'USD' },
    { name: 'UK', currency: 'GBP' },
    { name: 'Germany', currency: 'EUR' },
    { name: 'India', currency: 'INR' },
    { name: 'Canada', currency: 'CAD' },
    { name: 'Australia', currency: 'AUD' },
    { name: 'France', currency: 'EUR' },
    { name: 'Japan', currency: 'JPY' },
  ];

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Legal', 'Product', 'Customer Support'];

  const employees = [];

  for (let i = 0; i < 10000; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    employees.push({
      name: faker.person.fullName(),
      email: faker.internet.email({ firstName: faker.person.firstName(), lastName: faker.person.lastName(), provider: 'acme.com' }).toLowerCase() + Math.random(),
      department: departments[Math.floor(Math.random() * departments.length)],
      country: country.name,
      currency: country.currency,
      salary: parseFloat(faker.finance.amount({ min: 30000, max: 200000 })),
      hireDate: faker.date.past(),
    });
  }

  // Use createMany for performance with SQLite
  // Note: SQLite createMany is supported in newer Prisma versions
  await prisma.employee.createMany({
    data: employees,
  });

  console.log('Successfully seeded 10,000 employees.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
