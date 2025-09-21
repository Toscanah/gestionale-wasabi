import { EngagementContracts } from "../../shared";
import prisma from "../db";

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
