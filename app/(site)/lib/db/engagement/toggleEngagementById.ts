import { EngagementContracts } from "../../shared";
import prisma from "../db";

export default async function toggleEngagementById({
  engagementId,
}: EngagementContracts.ToggleById.Input): Promise<EngagementContracts.ToggleById.Output> {
  const engagement = await prisma.engagement.findFirst({
    where: {
      id: engagementId,
    },
    select: {
      enabled: true,
    },
  });

  if (!engagement) {
    throw new Error(`Engagement with id ${engagementId} not found.`);
  }

  const { enabled } = engagement;

  return await prisma.engagement.update({
    where: {
      id: engagementId,
    },
    data: {
      enabled: !enabled,
    },
    select: {
      id: true,
      enabled: true,
    },
  });
}
