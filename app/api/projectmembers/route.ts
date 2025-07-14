import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les membres de projet ou filtre par project_id ou student_id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project_id = searchParams.get('project_id');
  const student_id = searchParams.get('student_id');
  const where: any = {};
  if (project_id) where.project_id = project_id;
  if (student_id) where.student_id = student_id;
  const members = await prisma.projectMember.findMany({
    where,
    include: {
      project: true,
      student: true,
    },
    orderBy: { joined_at: 'desc' },
  });
  return NextResponse.json(members);
}

// POST: Ajoute un membre à un projet
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { project_id, student_id } = body;
  if (!project_id || !student_id) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence du projet et de l'étudiant
  const project = await prisma.project.findUnique({ where: { id: project_id } });
  const student = await prisma.profile.findUnique({ where: { id: student_id } });
  if (!project || !student) {
    return NextResponse.json({ error: 'Projet ou étudiant inexistant.' }, { status: 404 });
  }
  // Vérifier que le membre n'existe pas déjà
  const exists = await prisma.projectMember.findFirst({ where: { project_id, student_id } });
  if (exists) {
    return NextResponse.json({ error: 'Ce membre existe déjà dans ce projet.' }, { status: 409 });
  }
  const member = await prisma.projectMember.create({
    data: { project_id, student_id },
  });
  return NextResponse.json(member, { status: 201 });
}

// DELETE: Supprime un membre d'un projet (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.projectMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 