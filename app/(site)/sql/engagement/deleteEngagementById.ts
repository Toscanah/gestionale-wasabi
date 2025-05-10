import prisma from "../db";
import { DeleteEngagementById } from "../../shared";

export default async function deleteEngagementById({ engagementId }: DeleteEngagementById) {
  return await prisma.engagement.delete({
    where: {
      id: engagementId,
    },
    select: {
      id: true
    }
  });
}
