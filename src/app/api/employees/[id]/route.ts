import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: resolvedId } = await params;
    const body = await request.json();

    const updatedEmployee = await prisma.employee.update({
      where: { id: resolvedId },
      data: body,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Update Employee Error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // In Next.js 15, params is a Promise and needs to be awaited
    // This is likely why the ID was undefined in the previous calls
    const { id: resolvedId } = await params;

    await prisma.employee.delete({
      where: { id: resolvedId },
    });
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
