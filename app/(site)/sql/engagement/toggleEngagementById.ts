import { ToggleEngagementById } from "../../shared";
import prisma from "../db";

export default async function toggleEngagementById({ engagementId }: ToggleEngagementById) {
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

  await prisma.engagement.update({
    where: {
      id: engagementId,
    },
    data: {
      enabled: !enabled,
    },
  });

  return null;
}
