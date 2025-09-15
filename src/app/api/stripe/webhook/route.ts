import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("error al obtener la llave del webhook");
}
const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!stripeSecret) {
  throw new Error("Error al obtener la llave de Webhook");
}

const stripe = new Stripe(stripeSecretKey);

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  if (!sig) {
    throw new Error("Error al obtener la firma");
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeSecret);
    console.log("Stripe webhook recibido:", event.type, "id:", event.id);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionComplete = event.data.object;
      //!ACA GUARDO EN LA BASE DE DATOS ,   ENVIAR CORREO  O NOTIFICACION

      const courseId = checkoutSessionComplete.metadata?.courseId ?? null;
      const userId = checkoutSessionComplete.metadata?.userId ?? null;

      if (!courseId || !userId) {
        console.error(
          "Falta metadata en la sesión",
          checkoutSessionComplete.id
        );
        return NextResponse.json({ received: true })
      }

      const [course, user] = await Promise.all([
        prisma.course.findUnique({ where: { id: courseId } }),
        prisma.user.findUnique({ where: { id: userId } }),
      ]);
      if (!course || !user) {
        console.error("Curso o usuario no encontrado", { courseId, userId });
        return NextResponse.json({ received: true });
      }

      const stripeSessionId = checkoutSessionComplete.id;

      const stripeCustomerId =
        typeof checkoutSessionComplete.customer === "string"
          ? checkoutSessionComplete.customer
          : null;
      const amount = checkoutSessionComplete.amount_total
        ? checkoutSessionComplete.amount_total / 100
        : null;
      const currency = checkoutSessionComplete.currency || null;

      try {
        await prisma.purchase.upsert({
          where: { stripeSessionId },
          update: {}, // si ya existe no cambiamos nada (idempotencia)
          create: {
            stripeSessionId,
            stripeCustomerId: stripeCustomerId ?? undefined,
            amount: amount ?? undefined,
            currency: currency ?? undefined,
            userId,
            courseId,
          },
        });

        
        if (stripeCustomerId && !user.stripeCustomerId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId },
          });
        }

        console.log("Compra guardada:", { userId, courseId, stripeSessionId });
      } catch (err) {
        console.error("Error guardando en BD:", err);
      }

      return NextResponse.json({ received: true }); 
      default:
  console.log(`Evento no manejado ${event.type}`);
  return NextResponse.json({ received: true });
  }
};
