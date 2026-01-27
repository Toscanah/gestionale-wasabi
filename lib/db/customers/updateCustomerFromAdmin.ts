import { CustomerContracts } from "@/lib/shared";
import prisma from "../prisma";
import { engagementsInclude, homeAndPickupOrdersInclude } from "../includes";

export default async function updateCustomerFromAdmin({
  customer: input, // This is Customer A (e.g., ID 5)
}: CustomerContracts.UpdateFromAdmin.Input): Promise<CustomerContracts.UpdateFromAdmin.Output> {
  const { phone, addresses, ...customerData } = input;

  if (!phone) {
    throw new Error("A customer must have a phone number.");
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Find if Customer B (e.g., ID 7) exists with this phone
    const existingPhone = await tx.phone.findUnique({
      where: { phone: phone.phone },
      include: { customer: true },
    });

    const customerB = existingPhone?.customer;

    // --- MERGE FLOW ---
    if (customerB && customerB.id !== input.id) {
      // 2. Find the absolute last order of Customer A
      const [lastHomeOrder] = await tx.homeOrder.findMany({
        where: { customer_id: input.id },
        orderBy: { order: { created_at: "desc" } },
        take: 1,
      });

      const [lastPickupOrder] = await tx.pickupOrder.findMany({
        where: { customer_id: input.id },
        orderBy: { order: { created_at: "desc" } },
        take: 1,
      });

      let orderToMoveId: number | null = null;
      let isHomeType = false;

      if (lastHomeOrder && lastPickupOrder) {
        const oHome = await tx.order.findUnique({ where: { id: lastHomeOrder.id } });
        const oPick = await tx.order.findUnique({ where: { id: lastPickupOrder.id } });
        if (oHome && oPick && oHome.created_at > oPick.created_at) {
          orderToMoveId = lastHomeOrder.id;
          isHomeType = true;
        } else {
          orderToMoveId = lastPickupOrder.id;
        }
      } else if (lastHomeOrder) {
        orderToMoveId = lastHomeOrder.id;
        isHomeType = true;
      } else if (lastPickupOrder) {
        orderToMoveId = lastPickupOrder.id;
      }

      // 3. Move the Order to Customer B
      if (orderToMoveId) {
        if (isHomeType) {
          const hOrder = await tx.homeOrder.findUnique({ where: { id: orderToMoveId } });
          if (hOrder?.address_id) {
            await tx.address.update({
              where: { id: hOrder.address_id },
              data: { customer_id: customerB.id },
            });
          }
          await tx.homeOrder.update({
            where: { id: orderToMoveId },
            data: { customer_id: customerB.id },
          });
        } else {
          await tx.pickupOrder.update({
            where: { id: orderToMoveId },
            data: { customer_id: customerB.id },
          });
        }

        await tx.engagement.updateMany({
          where: { order_id: orderToMoveId },
          data: { customer_id: customerB.id },
        });
      }

      // 4. Delete Customer A (Hard Exit: scrap all other edits)
      await tx.customer.delete({ where: { id: input.id } });

      return await tx.customer.findUniqueOrThrow({
        where: { id: customerB.id },
        include: {
          phone: true,
          addresses: true,
          ...homeAndPickupOrdersInclude,
          ...engagementsInclude,
        },
      });
    }

    // --- STANDARD FLOW (No merge needed) ---

    // 1. Update Phone string
    await tx.phone.update({
      where: { id: input.phone_id },
      data: { phone: phone.phone },
    });

    // 2. Sync Addresses (Since no deletion allowed, we just Update or Create)
    if (addresses) {
      for (const addr of addresses) {
        if (addr.id <= 0) {
          // New address (negative temporary ID from frontend)
          await tx.address.create({
            data: {
              street: addr.street,
              civic: addr.civic,
              doorbell: addr.doorbell,
              floor: addr.floor,
              stair: addr.stair,
              street_info: addr.street_info,
              active: addr.active,
              temporary: addr.temporary,
              customer_id: input.id,
            },
          });
        } else {
          // Existing address update
          await tx.address.update({
            where: { id: addr.id },
            data: {
              street: addr.street,
              civic: addr.civic,
              doorbell: addr.doorbell,
              floor: addr.floor,
              stair: addr.stair,
              street_info: addr.street_info,
              active: addr.active,
              temporary: addr.temporary,
            },
          });
        }
      }
    }

    // 3. Update Customer Profile
    return await tx.customer.update({
      where: { id: input.id },
      data: {
        name: customerData.name,
        surname: customerData.surname,
        email: customerData.email,
        preferences: customerData.preferences,
        order_notes: customerData.order_notes,
        origin: customerData.origin,
      },
      include: {
        phone: true,
        addresses: true,
        ...homeAndPickupOrdersInclude,
        ...engagementsInclude,
      },
    });
  });
}
