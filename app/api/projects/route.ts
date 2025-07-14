import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les projets ou filtre par créateur ou superviseur
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const created_by = searchParams.get('created_by');
  const supervisor_id = searchParams.get('supervisor_id');
  const where: any = {};
  if (created_by) where.created_by = created_by;
  if (supervisor_id) where.supervisor_id = supervisor_id;
  const projects = await prisma.project.findMany({
    where,
    include: {
      creator: true,
      supervisor: true,
      members: true,
      taskLists: true,
      sessionReports: true,
      notes: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(projects);
}

// POST: Crée un nouveau projet
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, type, created_by, supervisor_id } = body;
  if (!title || !type || !created_by) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence du créateur et du superviseur (si fourni)
  const creator = await prisma.profile.findUnique({ where: { id: created_by } });
  if (!creator) {
    return NextResponse.json({ error: 'Créateur inexistant.' }, { status: 404 });
  }
  let supervisor = null;
  if (supervisor_id) {
    supervisor = await prisma.profile.findUnique({ where: { id: supervisor_id } });
    if (!supervisor) {
      return NextResponse.json({ error: 'Superviseur inexistant.' }, { status: 404 });
    }
  }
  const project = await prisma.project.create({
    data: {
      title,
      description,
      type,
      created_by,
      supervisor_id,
    },
  });
  return NextResponse.json(project, { status: 201 });
}

// PUT: Modifie un projet existant (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, type, supervisor_id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  // Vérifier l'existence du superviseur (si modifié)
  if (supervisor_id) {
    const supervisor = await prisma.profile.findUnique({ where: { id: supervisor_id } });
    if (!supervisor) {
      return NextResponse.json({ error: 'Superviseur inexistant.' }, { status: 404 });
    }
  }
  const project = await prisma.project.update({
    where: { id },
    data: { title, description, type, supervisor_id },
  });
  return NextResponse.json(project);
}

// DELETE: Supprime un projet (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 