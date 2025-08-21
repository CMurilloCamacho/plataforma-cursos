import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {registerUser} from "@/lib/services/auth-service"
import {generaToken} from "@/lib/services/auth-service"

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
 
  if (!body.name) {
    return NextResponse.json(
      { error: "debes llenar el nombre" },
      { status: 400 }
    );
  }
const newUser = await registerUser(body)
if (newUser instanceof NextResponse) {
  return newUser;
}
const token = await generaToken(newUser.id, newUser.role)
 
const response = NextResponse.json({...newUser, token}, {status:201})
response.cookies.set('token', token)
  return response
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 })
  }
};



export const GET = async () => {
  const data = await prisma.user.findMany({
    include: {
        courses: {
            select: {
                title: true,
                description: true,
                imageUrl: true
            }
        }
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const newData = data.map(({password: _, ...userWithoutPass})=>userWithoutPass) 
  return NextResponse.json({ message: "vista de usuarios", newData });
};

