import prisma from "../../db";
import { EngagementSchemaInputs } from "@/app/(site)/lib/shared";

export default async function deleteTemplateById({
  templateId,
}: EngagementSchemaInputs["DeleteTemplateByIdInput"]) {
  await prisma.$transaction(async (tx) => {
    // Step 1: Delete all engagements using the template
    await tx.engagement.deleteMany({
      where: {
        template_id: templateId,
      },
    });

    // Step 2: Delete the template itself
    await tx.engagementTemplate.delete({
      where: {
        id: templateId,
      },
    });
  });

  return templateId;
}
