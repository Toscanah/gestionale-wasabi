import prisma from "./../db";

export default async function createOrder(content: {
  
}) {
  await prisma.productsOnOrder.deleteMany();
  await prisma.order.deleteMany();

  for (let i = 0; i < 1; i++) {
    await prisma.order.create({
      data: {
        type: "TO_HOME",
        total: 24234,
        customer_id: 1,
        address_id: 1,
        products: {
          create: [
            {
              notes: "Stronzo",
              quantity: 243,
              total: 243,
              product: {
                connect: { id: 1 },
              },
            },
            {
              notes: "Another note",
              quantity: 100,
              total: 500,
              product: {
                connect: { id: 2 },
              },
            },
          ],
        },
      },
    });
  }

  return [];
}
