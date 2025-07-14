import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste toutes les tasklists ou filtre par project_id ou created_by
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project_id = searchParams.get('project_id');
  const created_by = searchParams.get('created_by');
  const where: any = {};
  if (project_id) where.project_id = project_id;
  if (created_by) where.created_by = created_by;
  const tasklists = await prisma.taskList.findMany({
    where,
    include: {
      project: true,
      creator: true,
      tasks: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(tasklists);
}

// POST: Crée une nouvelle tasklist
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, project_id, created_by } = body;
  if (!title || !project_id || !created_by) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence du projet et du créateur
  const project = await prisma.project.findUnique({ where: { id: project_id } });
  const creator = await prisma.profile.findUnique({ where: { id: created_by } });
  if (!project || !creator) {
    return NextResponse.json({ error: 'Projet ou créateur inexistant.' }, { status: 404 });
  }
  const tasklist = await prisma.taskList.create({
    data: { title, description, project_id, created_by },
  });
  return NextResponse.json(tasklist, { status: 201 });
}

// PUT: Modifie une tasklist existante (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, is_completed } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  const tasklist = await prisma.taskList.update({
    where: { id },
    data: { title, description, is_completed },
  });
  return NextResponse.json(tasklist);
}

// DELETE: Supprime une tasklist (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.taskList.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 