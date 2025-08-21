import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";



const extractToken = (req: NextRequest): string | null => {
  const token = req.cookies.get("token")?.value;
  console.log("TOKEN EXTRAIDO", token);
  if (token) return token;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

export async function PATCH(
  request: NextRequest,
  paramsOrPromise:
    | { params: { id: string } }
    | Promise<{ params: { id: string } }>
) {
  const { params } = await Promise.resolve(paramsOrPromise);
  const userId = params.id;

  const token = extractToken(request);
  if (!token) {
    return NextResponse.json({ error: "No estas Autorizado" }, { status: 403 });
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT secret not configured" },
      { status: 500 }
    );
  }
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
  } catch (error) {
    console.error("Error al verificar el token", error);
    return NextResponse.json(
      { error: "token no valido o expirado" },
      { status: 403 }
    );
  }
  if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes autorizacion" },
        { status: 403 }
      );
    }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    return NextResponse.json(
      {
        error: "El usuario no existe",
      },
      { status: 404 }
    );
  }

  if (
    existingUser.role &&
    !["STUDENT", "INSTRUCTOR"].includes(existingUser.role)
  ) {
    return NextResponse.json({ error: "rol no validos" }, { status: 400 });
  }
  const userRequest = await request.json();

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
    },
  });
  console.log("!!updateUser !!!", updateUser);

  return NextResponse.json(
    {
      user: updateUser,
    },
    { status: 200 }
  );
}
