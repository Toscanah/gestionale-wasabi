import { EngagementContract } from "../../../shared";
import prisma from "../../db";
import { EngagementTemplate } from "@prisma/client";

export default async function createEngagementTemplate({
  type,
  payload,
  label,
}: EngagementContract["Requests"]["CreateEngagementTemplate"]): Promise<EngagementTemplate> {
  return await prisma.engagementTemplate.create({
    data: {
      type,
      payload: payload as any,
      label: label ?? null,
    },
  });
}
