import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const middleware = async (request: NextRequest) => {
  console.log("MIDDLEWARE INICIADO", request.nextUrl.pathname);
if (request.nextUrl.pathname.startsWith('/api/stripe/webhook')) {
    return NextResponse.next() 
  }
  

  //! INICIAMOS CON TOKEN DE LAS COKIES

  const token = request.cookies.get("token")?.value;

  console.log("token con cookies", token ? "si" : "no hay token");

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({message: 'No estás autorizado para obtener los cursos'}, {status: 403})
        
    }
    return NextResponse.redirect(new URL('auth/login', request.url))
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("Missing JWT secret");
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secretKey);

    const headers = new Headers(request.headers);
    headers.set("userId", String(payload.sub));
    headers.set("userRole", String(payload.role));

    // Reglas de acceso
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      request.nextUrl.pathname.includes("/courses/new") &&
      !["INSTRUCTOR", "ADMIN"].includes(String(payload.role))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next({ request: { headers } });
  } catch (error) {
    console.error("Middleware error:", error);
    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({message: 'Token inválido o expirado'}, {status:401})
        
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
};

export const config = {
  matcher: ["/dashboard/:path*", "/api/courses/:path*", "/admin/:path*", "/api/stripe/:path*"],
};
