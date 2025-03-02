import { CustomerWithMarketing } from "../../models";
import prisma from "../db";
import { homeAndPickupOrdersInclude } from "../includes";

export default async function getCustomersWithMarketing(): Promise<CustomerWithMarketing[]> {
  return await prisma.customer.findMany({
    include: {
      addresses: true,
      phone: true,
      marketings: {
        include: {
          marketing: true,
        },
      },
      ...homeAndPickupOrdersInclude,
    },
  });
}
