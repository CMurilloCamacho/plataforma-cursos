import prisma from "@/lib/prisma";
import { CreateCourseInput } from "../types/course";
import Stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("No está definida la llave secreta de Stripe");
}
const stripe = new Stripe(stripeSecretKey);

export const createCourse = async (course: CreateCourseInput) => {
  let product: Stripe.Product | undefined;
  let priceObj: Stripe.Price | undefined;

  try {
    if (
      typeof course.price !== "number" ||
      isNaN(course.price) ||
      course.price < 0
    ) {
      throw new Error("El precio del curso es inválido.");
    }
    const unitAmout = Math.round(course.price * 100);
    product = await stripe.products.create({
      name: course.title,
      description: course.description,
      images: course.imageUrl ? [course.imageUrl]: undefined,
      metadata: {
        instructorId: course.instructorId,
      },
    });
    priceObj = await stripe.prices.create({
      unit_amount: unitAmout,
      currency: "usd",
      product: product.id,
    });

    const created = await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        price: course.price,
        imageUrl: course.imageUrl,
        instructorId: course.instructorId,
        stripeProductId: product.id,
        stripePriceId: priceObj.id,
      },
    });
    return created;
  } catch (error) {
    try {
      if (product?.id) {
        await stripe.products.del(product.id);
      }
    } catch (cleanError) {
      console.error(cleanError);
    }
    throw error;
  }
};




export const getCourses = async () => {
  return await prisma.course.findMany({
    include: { instructor: { select: { email: true } } },
  });
};

export const getCourseById = async (id: string) => {
  await prisma.course.findUnique({
    where: { id: id },
    include: {
      instructor: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};
