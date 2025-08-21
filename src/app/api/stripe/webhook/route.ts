// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) throw new Error("STRIPE_SECRET_KEY no definida");
if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET no definida");

const stripe = new Stripe(stripeSecretKey);

export const POST = async (req: NextRequest) => {
  try {
    // Leer cuerpo crudo como string (estable y compatible con Next)
    const rawBody = await req.text();

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      console.warn("Webhook sin stripe-signature header");
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️ Error verifying Stripe webhook signature:", err);
      return NextResponse.json({ message: "Firma inválida" }, { status: 400 });
    }

    // Logueamos el tipo de evento para rastrear qué llega
    console.log("✅ Stripe webhook recibido:", event.type, "id:", event.id);

    // Procesamos solo los eventos que nos interesan; para el resto devolvemos 200 rápido.
    // Esto evita que errores en handlers no relevantes devuelvan 500.
    switch (event.type) {
      case "checkout.session.completed": {
        try {
          const session = event.data.object as Stripe.Checkout.Session;
          const courseId = session.metadata?.courseId as string | undefined;
          const userId = session.metadata?.userId as string | undefined;
          const sessionId = session.id;
          const customerId = typeof session.customer === "string" ? session.customer : undefined;
          const amountTotal = (session.amount_total ?? 0) as number;
          const currency = (session.currency ?? "usd") as string;

          if (!courseId || !userId) {
            console.warn("checkout.session.completed sin metadata necesaria:", sessionId);
            return NextResponse.json({ received: true }, { status: 200 });
          }

          // Idempotencia: si ya existe un purchase con ese sessionId o (user+course), no duplicar.
          const existingBySession = await prisma.purchase.findFirst({
            where: { stripeSessionId: sessionId },
          });
          if (existingBySession) {
            console.log("Purchase ya registrado por sessionId:", sessionId);
            return NextResponse.json({ received: true }, { status: 200 });
          }

          const existingByUserCourse = await prisma.purchase.findFirst({
            where: { courseId, userId },
          });
          if (existingByUserCourse) {
            console.log("Purchase ya existe para user+course:", userId, courseId);
            // opcional: podrías actualizar stripeSessionId si quieres
            await prisma.purchase.update({
              where: { id: existingByUserCourse.id },
              data: { stripeSessionId: sessionId, stripeCustomerId: customerId ?? undefined },
            });
            return NextResponse.json({ received: true }, { status: 200 });
          }

          // Crear purchase y guardar metadatos de Stripe
          await prisma.purchase.create({
            data: {
              courseId,
              userId,
              // Requiere que hayas agregado estos campos al modelo Purchase (si no, quitar)
              stripeSessionId: sessionId,
              stripeCustomerId: customerId,
              amount: amountTotal / 100.0,
              currency,
            },
          });

          console.log(`Purchase creado: user=${userId} course=${courseId} session=${sessionId}`);
          return NextResponse.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error("Error procesando checkout.session.completed:", err);
          // 500 -> Stripe reintentará. Útil si es un fallo temporal en DB.
          return NextResponse.json({ message: "Error interno al procesar sesión" }, { status: 500 });
        }
      }

      // Si quieres procesar payment_intent.succeeded u otros, implementa bloques similares
      // por ahora los registramos y devolvemos 200 para evitar 500.
      default: {
        console.log("Evento no manejado (aceptado):", event.type);
        return NextResponse.json({ received: true }, { status: 200 });
      }
    }
  } catch (error) {
    // Error inesperado; log completo para depuración
    console.error("Webhook handler fallo inesperado:", error);
    return NextResponse.json({ message: "Error interno webhook" }, { status: 500 });
  }
};
