import { EngagementContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function deleteEngagementById({
  engagementId,
}: EngagementContracts.DeleteEngagementById.Input): Promise<EngagementContracts.DeleteEngagementById.Output> {
  return await prisma.engagement.delete({
    where: {
      id: engagementId,
    },
    select: {
      id: true,
    },
  });
}
