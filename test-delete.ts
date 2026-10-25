import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDelete() {
  // We will try to delete an employee to see if it works in a script
  const emp = await prisma.employee.findFirst();
  if (!emp) {
    console.log('No employees found to test deletion.');
    return;
  }

  console.log(`Attempting to delete employee: ${emp.name} (ID: ${emp.id})`);
  try {
    await prisma.employee.delete({
      where: { id: emp.id },
    });
    console.log('Successfully deleted via script.');
  } catch (e) {
    console.error('Deletion failed via script:', e);
  }
}

testDelete()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
