import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Calculate Total Payroll and Average Salary globally
    const aggregate = await prisma.employee.aggregate({
      _sum: { salary: true },
      _avg: { salary: true },
      _count: { id: true },
    });

    // Calculate Distribution by Country
    const countryDistribution = await prisma.employee.groupBy({
      by: ['country'],
      _sum: { salary: true },
      _count: { id: true },
    });

    // Calculate Distribution by Department
    const deptDistribution = await prisma.employee.groupBy({
      by: ['department'],
      _sum: { salary: true },
      _count: { id: true },
    });

    return Response.json({
      summary: {
        totalPayroll: aggregate._sum.salary || 0,
        avgSalary: aggregate._avg.salary || 0,
        totalEmployees: aggregate._count.id || 0,
      },
      countryDistribution,
      deptDistribution,
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
