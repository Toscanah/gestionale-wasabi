import prisma from "../db";

export default async function createPickupOrder(content: {
  name: string;
  when: string;
  phone?: string;
}) {
  const { name, when, phone } = content;

  let createdOrder;

  if (phone) {
    // Check if the phone already exists
    const existingPhone = await prisma.phone.findFirst({
      where: { phone: phone },
    });

    if (existingPhone) {
      // Phone exists, create the order with the existing phone
      createdOrder = await prisma.order.create({
        data: {
          type: "PICK_UP",
          total: 0,
          pickup_order: {
            create: {
              name: name,
              when: when,
              customer: {
                connectOrCreate: {
                  where: { id: existingPhone.id },
                  create: {
                    name: name,
                    surname: "",
                    phone: {
                      create: { phone: phone },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          pickup_order: true,
          products: true,
        },
      });
    } else {
      // Phone does not exist, create the phone and the order
      createdOrder = await prisma.order.create({
        data: {
          type: "PICK_UP",
          total: 0,
          pickup_order: {
            create: {
              name: name,
              when: when,
              customer: {
                create: {
                  name: name,
                  surname: "",
                  phone: {
                    create: { phone: phone },
                  },
                },
              },
            },
          },
        },
        include: {
          pickup_order: true,
          products: true,
        },
      });
    }
  } else {
    // No phone provided, create the order without customer details
    createdOrder = await prisma.order.create({
      data: {
        type: "PICK_UP",
        total: 0,
        pickup_order: {
          create: {
            name: name,
            when: when,
          },
        },
      },
      include: {
        pickup_order: true,
        products: true,
      },
    });
  }

  return createdOrder;
}
