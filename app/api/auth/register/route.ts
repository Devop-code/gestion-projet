import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';



export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, role } = await req.json();
  console.log(email , password , firstName , lastName , role)
  const  user = {
    email:email,
    password:password,
    firstName:firstName,
    lastName:lastName,
    role:role
  }

  if (typeof user.email != 'string' || typeof user.firstName != 'string' || typeof user.lastName != 'string' || typeof user.password != 'string') {
     return NextResponse.json({ok:false ,error:'invalid form data'} ,{status:400})
  }
  const existingEmail= await prisma.profile.findUnique({
    where:{
      email:user.email
    }
  })
if (existingEmail) {
console.log("user email already exist !  try another one")
return NextResponse.json({ok:false,error:"user email already exist"},{status:401})

}
  const newUser = await prisma.profile.create({
    data:{
      email:user.email,
      password:(await bcrypt.hash(user.password,8)).toString(),
      first_name:user.firstName,
      last_name:user.lastName,
      role:user.role
    }
  })

  return NextResponse.json([
    newUser
])
}