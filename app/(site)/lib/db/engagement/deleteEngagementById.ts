import { EngagementContract } from "../../shared";
import prisma from "../db";

export default async function deleteEngagementById({
  engagementId,
}: EngagementContract["Requests"]["DeleteEngagementById"]) {
  return await prisma.engagement.delete({
    where: {
      id: engagementId,
    },
    select: {
      id: true,
    },
  });
}
