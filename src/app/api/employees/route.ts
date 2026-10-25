import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';
  const country = searchParams.get('country') || '';
  const department = searchParams.get('department') || '';

  const skip = (page - 1) * limit;

  try {
    const where: any = {
      AND: []
    };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { department: { contains: search } },
          { country: { contains: search } },
        ],
      });
    }

    if (country) {
      where.AND.push({ country });
    }

    if (department) {
      where.AND.push({ department });
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return NextResponse.json({
      employees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch Employees Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const employee = await prisma.employee.create({
      data: body,
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Could not create employee' }, { status: 400 });
  }
}
