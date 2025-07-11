import { CreateEngagementTemplate } from "@/app/(site)/lib/shared";
import prisma from "../../db";
import { EngagementTemplate } from "@prisma/client";

export default async function createEngagementTemplate({
  type,
  payload,
  label,
}: CreateEngagementTemplate): Promise<EngagementTemplate> {
  return await prisma.engagementTemplate.create({
    data: {
      type,
      payload: payload as any,
      label: label ?? null,
    },
  });
}
