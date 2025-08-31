import { CustomerContract } from "@/app/(site)/lib/shared";
import { Prisma } from "@prisma/client";

export default function buildCustomerWhere(
  filters?: CustomerContract["Requests"]["GetCustomersWithDetails"]["filters"]
): Prisma.CustomerWhereInput {
  const { search, ranks } = filters || {};

  const orConditions: Prisma.CustomerWhereInput[] = [];

  if (search?.trim()) {
    orConditions.push(
      { name: { contains: search, mode: "insensitive" } },
      { surname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      {
        phone: {
          phone: { contains: search, mode: "insensitive" },
        },
      },
      {
        rfm: {
          path: ["rank"],
          string_contains: search,
          mode: "insensitive",
        },
      },
      {
        addresses: {
          some: {
            doorbell: { contains: search, mode: "insensitive" },
          },
        },
      }
    );
  }

  if (ranks && ranks.length > 0) {
    orConditions.push(
      ...ranks.map((r) => ({
        rfm: {
          path: ["rank"],
          string_contains: r,
        },
      }))
    );
  }

  return orConditions.length > 0 ? { OR: orConditions } : {};
}
