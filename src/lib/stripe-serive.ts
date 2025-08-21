import prisma from "./prisma";
import Stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Error al obtener la llave de Stripe");
}
const stripe = new Stripe(stripeSecretKey);

export const getOrCreateStripeCustomer = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("Usuario No encontrado");
  }
  try {
    if (user.stripeCustomerId) {
      const retrieved = await stripe.customers.retrieve(user.stripeCustomerId);
      if (!retrieved.deleted) {
        return user.stripeCustomerId;
      }
    }
  } catch (error) {
    console.error(error);
  }
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
        userId: user.id,
        role: user.role
    }
  })
  return customer.id
};
