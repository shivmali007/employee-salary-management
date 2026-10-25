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
    const countryDistributionRaw = await prisma.employee.groupBy({
      by: ['country'],
      _sum: { salary: true },
      _count: { id: true },
    });

    // Normalize country names to avoid duplicates (e.g., "India" vs "india")
    const countryMap = new Map();
    countryDistributionRaw.forEach(item => {
      const normalized = item.country.charAt(0).toUpperCase() + item.country.slice(1).toLowerCase();
      const existing = countryMap.get(normalized) || { country: normalized, _sum: { salary: 0 }, _count: { id: 0 } };
      existing._sum.salary += item._sum.salary;
      existing._count.id += item._count.id;
      countryMap.set(normalized, existing);
    });
    const countryDistribution = Array.from(countryMap.values());

    // 1. Calculate overall Distribution by Department for the chart
    const deptDistributionRaw = await prisma.employee.groupBy({
      by: ['department'],
      _sum: { salary: true },
      _count: { id: true },
    });

    // Normalize department names to avoid duplicates (e.g., "Legal" vs "legal")
    const deptMap = new Map();
    deptDistributionRaw.forEach(item => {
      const normalized = item.department.charAt(0).toUpperCase() + item.department.slice(1).toLowerCase();
      const existing = deptMap.get(normalized) || { department: normalized, _sum: { salary: 0 }, _count: { id: 0 } };
      existing._sum.salary += item._sum.salary;
      existing._count.id += item._count.id;
      deptMap.set(normalized, existing);
    });
    const deptDistribution = Array.from(deptMap.values());

    // 2. Calculate Detailed Breakdown: Department AND Country
    const detailedBreakdownRaw = await prisma.employee.groupBy({
      by: ['department', 'country'],
      _sum: { salary: true },
      _count: { id: true },
    });

    // Normalize both department and country names in detailed breakdown
    const detailedMap = new Map();
    detailedBreakdownRaw.forEach(item => {
      const normalizedDept = item.department.charAt(0).toUpperCase() + item.department.slice(1).toLowerCase();
      const normalizedCountry = item.country.charAt(0).toUpperCase() + item.country.slice(1).toLowerCase();
      const key = `${normalizedDept}|${normalizedCountry}`;

      const existing = detailedMap.get(key) || { department: normalizedDept, country: normalizedCountry, _sum: { salary: 0 }, _count: { id: 0 } };
      existing._sum.salary += item._sum.salary;
      existing._count.id += item._count.id;
      detailedMap.set(key, existing);
    });
    const detailedBreakdown = Array.from(detailedMap.values());

    return Response.json({
      summary: {
        totalPayroll: aggregate._sum.salary || 0,
        avgSalary: aggregate._avg.salary || 0,
        totalEmployees: aggregate._count.id || 0,
      },
      countryDistribution,
      deptDistribution,
      detailedBreakdown,
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
