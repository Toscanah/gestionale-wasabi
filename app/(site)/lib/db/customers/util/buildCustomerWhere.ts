import { CustomerSchemaInputs } from "@/app/(site)/lib/shared";
import { Prisma } from "@prisma/client";

export default function buildCustomerWhere(
  filters?: CustomerSchemaInputs["GetCustomersWithDetailsInput"]["filters"]
): Prisma.CustomerWhereInput {
  const { search, rank } = filters || {};

  const normalSearch: Prisma.CustomerWhereInput = search
    ? {
        OR: [
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
            },
          },
          {
            addresses: {
              some: {
                doorbell: { contains: search, mode: "insensitive" },
              },
            },
          },
        ],
      }
    : {};

  const rankSearch: Prisma.CustomerWhereInput =
    rank && rank != "all"
      ? {
          rfm: {
            path: ["rank"],
            equals: rank,
          },
        }
      : {};

  return {
    ...normalSearch,
    ...rankSearch,
  };
}
