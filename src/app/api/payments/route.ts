// import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined in environment variables.");
}
export const GET = async () => {
  try {
    const stripe = new Stripe(stripeSecretKey);
    const prices = await stripe.prices.list();
    return NextResponse.json(prices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al ver la lista de precios" });
  }
};



// export async function POST(req: NextRequest) {
//     try {
//         const { amount, currency, description } = await req.json();

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency,
//             description,
//         });

//         return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         return NextResponse.json({ error: errorMessage }, { status: 500 });
//     }
// }
