import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les rapports de session ou filtre par project_id, author_id, validated_by
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project_id = searchParams.get('project_id');
  const author_id = searchParams.get('author_id');
  const validated_by = searchParams.get('validated_by');
  const where: any = {};
  if (project_id) where.project_id = project_id;
  if (author_id) where.author_id = author_id;
  if (validated_by) where.validated_by = validated_by;
  const sessionReports = await prisma.sessionReport.findMany({
    where,
    include: {
      project: true,
      author: true,
      validator: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(sessionReports);
}

// POST: Crée un nouveau rapport de session
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, content, session_date, project_id, author_id } = body;
  if (!title || !content || !session_date || !project_id || !author_id) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence du projet et de l'auteur
  const project = await prisma.project.findUnique({ where: { id: project_id } });
  const author = await prisma.profile.findUnique({ where: { id: author_id } });
  if (!project || !author) {
    return NextResponse.json({ error: 'Projet ou auteur inexistant.' }, { status: 404 });
  }
  const sessionReport = await prisma.sessionReport.create({
    data: { title, content, session_date, project_id, author_id },
  });
  return NextResponse.json(sessionReport, { status: 201 });
}

// PUT: Modifie un rapport de session existant (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, content, is_validated, validated_by, validated_at } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  // Vérifier l'existence du validateur (si modifié)
  if (validated_by) {
    const validator = await prisma.profile.findUnique({ where: { id: validated_by } });
    if (!validator) {
      return NextResponse.json({ error: 'Validateur inexistant.' }, { status: 404 });
    }
  }
  const sessionReport = await prisma.sessionReport.update({
    where: { id },
    data: { title, content, is_validated, validated_by, validated_at },
  });
  return NextResponse.json(sessionReport);
}

// DELETE: Supprime un rapport de session (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.sessionReport.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 