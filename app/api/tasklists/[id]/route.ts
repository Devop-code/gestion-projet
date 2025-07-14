import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const tasklist = await prisma.taskList.findUnique({
    where: { id },
    include: { project: true, creator: true, tasks: true },
  });
  if (!tasklist) return NextResponse.json({ error: 'TaskList non trouvée.' }, { status: 404 });
  return NextResponse.json(tasklist);
} 