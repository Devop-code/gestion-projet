import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste toutes les tâches ou filtre par task_list_id, created_by, assigned_to
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const task_list_id = searchParams.get('task_list_id');
  const created_by = searchParams.get('created_by');
  const assigned_to = searchParams.get('assigned_to');
  const where: any = {};
  if (task_list_id) where.task_list_id = task_list_id;
  if (created_by) where.created_by = created_by;
  if (assigned_to) where.assigned_to = assigned_to;
  const tasks = await prisma.task.findMany({
    where,
    include: {
      taskList: true,
      creator: true,
      assignee: true,
    },
    orderBy: { created_at: 'desc' },
  });
  return NextResponse.json(tasks);
}

// POST: Crée une nouvelle tâche
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, status, task_list_id, created_by, assigned_to } = body;
  if (!title || !status || !task_list_id || !created_by) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
  }
  // Vérifier l'existence de la liste, du créateur et de l'assigné (si fourni)
  const taskList = await prisma.taskList.findUnique({ where: { id: task_list_id } });
  const creator = await prisma.profile.findUnique({ where: { id: created_by } });
  if (!taskList || !creator) {
    return NextResponse.json({ error: 'Liste ou créateur inexistant.' }, { status: 404 });
  }
  let assignee = null;
  if (assigned_to) {
    assignee = await prisma.profile.findUnique({ where: { id: assigned_to } });
    if (!assignee) {
      return NextResponse.json({ error: 'Assigné inexistant.' }, { status: 404 });
    }
  }
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      task_list_id,
      created_by,
      assigned_to,
    },
  });
  return NextResponse.json(task, { status: 201 });
}

// PUT: Modifie une tâche existante (id dans le body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, status, assigned_to, completed_at } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  // Vérifier l'existence de l'assigné (si modifié)
  if (assigned_to) {
    const assignee = await prisma.profile.findUnique({ where: { id: assigned_to } });
    if (!assignee) {
      return NextResponse.json({ error: 'Assigné inexistant.' }, { status: 404 });
    }
  }
  const task = await prisma.task.update({
    where: { id },
    data: { title, description, status, assigned_to, completed_at },
  });
  return NextResponse.json(task);
}

// DELETE: Supprime une tâche (id dans le body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
  }
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 