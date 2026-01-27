import { Prisma } from "@/prisma/generated/client/client";
import { CommonQueryFilter } from "@/lib/shared/contracts/common/filters/query";

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
