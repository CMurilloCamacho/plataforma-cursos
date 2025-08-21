import { getOrCreateStripeCustomer } from "@/lib/stripe-serive";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        {
          message: "No hay usuario autenticado",
        },
        { status: 401 }
      );
    }
    const customerId = await getOrCreateStripeCustomer(userId);
    return NextResponse.json(
      { stripeCustomerId: customerId, message: "Customer listo." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error al crear al cliente",
      },
      { status: 500 }
    );
  }
};
