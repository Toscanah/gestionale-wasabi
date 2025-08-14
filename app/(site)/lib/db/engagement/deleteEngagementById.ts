import { EngagementSchemaInputs } from "../../shared";
import prisma from "../db";

export default async function deleteEngagementById({
  engagementId,
}: EngagementSchemaInputs["DeleteEngagementByIdInput"]) {
  return await prisma.engagement.delete({
    where: {
      id: engagementId,
    },
    select: {
      id: true,
    },
  });
}
