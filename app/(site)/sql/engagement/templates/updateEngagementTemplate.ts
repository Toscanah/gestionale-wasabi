import { UpdateEngagementTemplate } from "@/app/(site)/shared";
import prisma from "../../db";
import { EngagementTemplate } from "@prisma/client";

export default async function updateEngagementTemplate({
  id,
  label,
  payload,
}: UpdateEngagementTemplate): Promise<EngagementTemplate> {
  return await prisma.engagementTemplate.update({
    where: { id },
    data: {
      label,
      payload: payload as any,
    },
  });
}
