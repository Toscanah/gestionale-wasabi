import { Prisma } from "@prisma/client";
import { CommonQueryFilter } from "../../../shared/schemas/common/query";

export default function customerWhereQuery({
  query,
}: CommonQueryFilter): Prisma.CustomerWhereInput {
  if (!query?.trim()) return {};

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { surname: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phone: { phone: { contains: query, mode: "insensitive" } } },
      { addresses: { some: { doorbell: { contains: query, mode: "insensitive" } } } },
    ],
  };
}
