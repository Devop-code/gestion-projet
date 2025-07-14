import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les profils ou récupère un profil par id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        projectsCreated: true,
        projectsSupervised: true,
        projectMemberships: true,
        tasksCreated: true,
        tasksAssigned: true,
        sessionReports: true,
        notes: true,
        taskListsCreated: true,
        sessionReportsValidated: true,
      },
    });
    if (!profile) return NextResponse.json({ error: 'Profil non trouvé.' }, { status: 404 });
    return NextResponse.json(profile);
  }
  // Liste tous les profils
  const profiles = await prisma.profile.findMany({
    include: {
      projectsCreated: true,
      projectsSupervised: true,
      projectMemberships: true,
      tasksCreated: true,
      tasksAssigned: true,
      sessionReports: true,
      notes: true,
      taskListsCreated: true,
      sessionReportsValidated: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(profiles);
}

// PUT: Modifie un profil (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, first_name, last_name, email, role } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  const profile = await prisma.profile.update({
    where: { id },
    data: { first_name, last_name, email, role },
  });
  return NextResponse.json(profile);
}

// DELETE: Supprime un profil (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.profile.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
