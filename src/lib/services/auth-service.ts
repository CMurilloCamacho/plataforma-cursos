import prisma from "@/lib/prisma";

import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';
import { NextResponse } from "next/server";
import { LoginUser } from "../types/login";
import { RegisterInput } from "../types/registerInput";


export const registerUser = async (req: RegisterInput) => {
  const user = req;
  const findUser = await prisma.user.findUnique({
    where: { email: req.email },
  });
  if (findUser) {
    return NextResponse.json({ error: "el email ya existe" }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(user.password, 10);
  return await prisma.user.create({
    data: { ...user, password: passwordHash },
  });
};

export const generaToken = async (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET as string;
  const payload = { sub: userId , role:  role
    
  };
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt() 
    .setExpirationTime("24h") 
    .sign(new TextEncoder().encode(secret));
    return token
};

//!devolver el token en una cookie



export const loginUser = async (req: LoginUser) => {
 try {
     const { email, password } = req;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!findUser) {
    return NextResponse.json(
      { message: "no se encontró al usuario" },
      { status: 404 }
    );
  }
  const passCompare = await bcrypt.compare(password, findUser.password);
  if (!passCompare) {
    return NextResponse.json(
      { message: "Credenciales incorrectas" },
      { status: 400 }
    );
  }


const token = await generaToken(findUser.id, findUser.role)
const response =  NextResponse.json({
    message: 'Inicio de sesión exitoso',
    user: {
        name: findUser.name,
        role: findUser.role,
    },
    token
})
response.cookies.set('token', token)
return response
 } catch (error) {
    const message = error instanceof Error ? error.message : "Ocurrió un error";
    return NextResponse.json({ message }, { status: 400 });
 }

};


