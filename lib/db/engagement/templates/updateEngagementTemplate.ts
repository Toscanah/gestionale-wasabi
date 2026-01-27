import normalizeTemplatePayload from "../../../services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "@/lib/shared";
import prisma from "../../prisma";

export default async function updateEngagementTemplate({
  id,
  label,
  redeemable,
  payload,
}: EngagementContracts.UpdateTemplate.Input): Promise<EngagementContracts.UpdateTemplate.Output> {
  const prev = await prisma.engagementTemplate.findUnique({
    where: { id },
    select: { redeemable: true },
  });

  if (!prev) {
    throw new Error(`EngagementTemplate ${id} not found`);
  }

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

  return normalizeTemplatePayload(updated);
}
