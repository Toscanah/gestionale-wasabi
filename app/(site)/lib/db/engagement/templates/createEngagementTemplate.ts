import normalizeTemplatePayload from "../../../services/engagement/normalizeTemplatePayload";
import { EngagementContracts } from "../../../shared";
import prisma from "../../prisma";

export default async function createEngagementTemplate({
  type,
  payload,
  label,
}: EngagementContracts.CreateTemplate.Input): Promise<EngagementContracts.CreateTemplate.Output> {
  return normalizeTemplatePayload(
    await prisma.engagementTemplate.create({
      data: {
        type,
        payload: payload as any,
        label: label ?? null,
      },
    })
  );
}
