import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

// GET: Liste toutes les notes ou filtre par project_id ou author_id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project_id = searchParams.get('project_id');
  const author_id = searchParams.get('author_id');
  const where: any = {};
  if (project_id) where.project_id = project_id;
  if (author_id) where.author_id = author_id;
  const notes = await prisma.note.findMany({
    where,
    include: {
      project: true,
      author: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(notes);
}

// POST: Crée une nouvelle note
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, project_id, author_id } = body;
  if (!title || !content || !project_id || !author_id) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence du projet et de l'auteur
  const project = await prisma.project.findUnique({ where: { id: project_id } });
  const author = await prisma.profile.findUnique({ where: { id: author_id } });
  if (!project || !author) {
    return NextResponse.json({ error: 'Projet ou auteur inexistant.' }, { status: 404 });
  }
  const note = await prisma.note.create({
    data: { title, content, project_id, author_id },
  });
  return NextResponse.json(note, { status: 201 });
}

// PUT: Modifie une note existante (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, content } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  const note = await prisma.note.update({
    where: { id },
    data: { title, content },
  });
  return NextResponse.json(note);
}

// DELETE: Supprime une note (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 