import prisma from "@/lib/prisma";
import { getOrCreateStripeCustomer } from "@/lib/stripe-serive";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Error al obtener la llave");
}

const appBaseUrl = process.env.NEXT_PUBLIC_URL;

if (!appBaseUrl) {
  throw new Error("NEXT_PUBLIC_URL no está definida en el entorno.");
}
const stripe = new Stripe(stripeSecretKey);

export const POST = async (req: NextRequest) => {


    try {
        const userId = req.headers.get("userid");
  if (!userId) {
    return NextResponse.json({ message: "No autenticado." }, { status: 401 });
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json(
      { message: "Falta 'courseId' en el cuerpo de la petición." },
      { status: 400 }
    );
  }

  //!buscamos el curso
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!course) {
    return NextResponse.json(
      { message: "Curso no encontrado." },
      { status: 404 }
    );
  }
  if (!course.stripePriceId) {
    return NextResponse.json(
      { message: "El curso no tiene 'stripePriceId' configurado." },
      { status: 409 }
    );
  }
  const customerId = await getOrCreateStripeCustomer(userId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        price: course.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${appBaseUrl}/checkout/succes?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${appBaseUrl}/courses/${course.id}`,
     metadata: {
        courseId: course.id,
        userId
     }
  });
  return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
      { message: "Error interno creando la sesión de pago." },
      { status: 500 }
    );
    }
  
};
