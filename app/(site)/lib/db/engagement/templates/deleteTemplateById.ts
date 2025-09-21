import { EngagementContracts } from "../../../shared";
import prisma from "../../db";

export default async function deleteTemplateById({
  templateId,
}: EngagementContracts.DeleteTemplateById.Input): Promise<EngagementContracts.DeleteTemplateById.Output> {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Delete all engagements using the template
    await tx.engagement.deleteMany({
      where: {
        template_id: templateId,
      },
    });

    // Step 2: Delete the template itself
    return await tx.engagementTemplate.delete({
      where: {
        id: templateId,
      },
    });
  });
}
