import prisma from "../db";

export default async function createPickupOrder(content: {
  name: string;
  when: string;
  phone?: string;
}) {
  const { name, when, phone } = content;
  let customerData = undefined;

  // Check if the phone already exists
  if (phone) {
    const existingPhone = await prisma.phone.findFirst({
      where: { phone: phone },
      include: { customer: true },
    });

    // Phone exists, connect the existing customer
    if (existingPhone) {
      customerData = {
        connect: {
          id: existingPhone.customer.id,
        },
      };
    } else {
      // Phone does not exist, create new customer and phone
      customerData = {
        create: {
          name: name,
          surname: "",
          phone: {
            create: { phone: phone },
          },
        },
      };
    }
  }

  // Create the order with or without customer data
  const createdOrder = await prisma.order.create({
    data: {
      type: "PICK_UP",
      total: 0,
      pickup_order: {
        create: {
          name: name,
          when: when,
          customer: customerData,
        },
      },
    },
    include: {
      pickup_order: true,
      products: true,
    },
  });

  return createdOrder;
}
