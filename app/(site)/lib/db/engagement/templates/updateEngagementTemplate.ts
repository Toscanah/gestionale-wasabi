import { EngagementContract } from "../../../shared";
import prisma from "../../db";
import { EngagementTemplate } from "@prisma/client";

export default async function updateEngagementTemplate({
  id,
  label,
  redeemable,
  payload,
}: EngagementContract["Requests"]["UpdateEngagementTemplate"]): Promise<EngagementTemplate> {
  const prev = await prisma.engagementTemplate.findUnique({
    where: { id },
    select: { redeemable: true },
  });

  if (!prev) throw new Error(`EngagementTemplate ${id} not found`);

  const updated = await prisma.$transaction(async (tx) => {
    const tpl = await tx.engagementTemplate.update({
      where: { id },
      data: {
        label,
        payload: payload as any,
        redeemable, 
      },
    });

    if (prev.redeemable === true && redeemable === false) {
      await tx.engagementLedger.deleteMany({
        where: {
          engagement: { template_id: id },
        },
      });
    }

    return tpl;
  });

  return updated;
}
