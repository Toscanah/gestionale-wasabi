import { FinalUpdateEngagementTemplate } from "@/app/(site)/shared";
import prisma from "../../db";

export default async function updateEngagementTemplate({
  id,
  label,
  payload,
}: FinalUpdateEngagementTemplate) {
  return await prisma.engagementTemplate.update({
    where: { id },
    data: {
      label,
      payload: payload as any,
    },
  });
}
