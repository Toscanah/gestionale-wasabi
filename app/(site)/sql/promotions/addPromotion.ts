import prisma from "../db";

export default async function addPromotion(
  customerId: number,
  discount: { amount: number | null; percentage: number | null } | null,
  extraProduct: { productId: number; productDiscount: number | null } | null
) {
  if (discount && discount.amount === null && discount.percentage === null) {
    throw new Error("At least one discount type (amount or percentage) must be provided.");
  }

  if (!discount && !extraProduct) {
    throw new Error("Either a discount or an extra product must be provided.");
  }

  const customerExists = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customerExists) {
    throw new Error(`Customer with ID ${customerId} not found.`);
  }

  if (extraProduct) {
    const productExists = await prisma.product.findUnique({
      where: { id: extraProduct.productId },
    });

    if (!productExists) {
      throw new Error(`Product with ID ${extraProduct.productId} not found.`);
    }
  }

  const newPromotion = await prisma.promotion.create({
    data: {
      customer_id: customerId,
      discount_amount: discount?.amount ?? null,
      discount_percentage: discount?.percentage ?? null,
      extra_product_id: extraProduct?.productId ?? null,
      extra_product_discount: extraProduct?.productDiscount ?? null,
      exp_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  return newPromotion;
}
