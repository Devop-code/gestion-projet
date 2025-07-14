import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
const userInfo = {
  email:email,
  password:password
}
console.log(userInfo);

  
  const user = await prisma.profile.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      created_at: user.created_at,
    },
  });
} 