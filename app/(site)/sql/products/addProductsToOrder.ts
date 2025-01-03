import { ProductInOrder } from "../../models";
import prisma from "../db";

export default async function addProductsToOrder(
  targetOrderId: number,
  products: ProductInOrder[]
): Promise<ProductInOrder[]> {
  const productTotalPrice = products.reduce((sum, product) => sum + product.total, 0);

  const newProducts = await Promise.all(
    products.map(async (productInOrder) => {
      const newProductInOrder = await prisma.productInOrder.create({
        data: {
          order_id: targetOrderId,
          product_id: productInOrder.product.id,
          quantity: productInOrder.quantity,
          total: productInOrder.total,
          rice_quantity: productInOrder.product.rice * productInOrder.quantity,
        },
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    select: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            include: {
              option: true,
            },
          },
        },
      });

      return newProductInOrder;
    })
  );

  const optionsToCreate = newProducts.flatMap((newProduct, index) => {
    const originalProduct = products[index];
    return (originalProduct.options || []).map((option) => ({
      product_in_order_id: newProduct.id,
      option_id: option.option.id,
    }));
  });

  if (optionsToCreate.length > 0) {
    console.log("Sono entrato in addPRoductToORder")
    await prisma.optionInProductOrder.createMany({
      data: optionsToCreate,
    });
  }

  await prisma.order.update({
    where: {
      id: targetOrderId,
    },
    data: {
      total: {
        increment: productTotalPrice,
      },
      is_receipt_printed: false,
    },
  });

  return newProducts;
}
