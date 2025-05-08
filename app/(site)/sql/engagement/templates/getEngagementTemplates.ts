import { EngagementTemplate, EngagementType } from "@prisma/client";
import prisma from "../../db";
import {
  ImagePayload,
  MessagePayload,
  ParsedEngagementTemplate,
  QrPayload,
} from "@/app/(site)/shared";

function normalizeTemplatePayload(template: EngagementTemplate): ParsedEngagementTemplate {
  const base = {
    ...template,
    payload: {
      textAbove: "",
      textBelow: "",
      ...(template.payload ?? ({} as any)),
    },
  };

  switch (template.type) {
    case EngagementType.QR_CODE:
      return {
        ...base,
        payload: {
          url: "",
          ...base.payload,
        } as QrPayload,
      };

    case EngagementType.IMAGE:
      return {
        ...base,
        payload: {
          imageUrl: "",
          ...base.payload,
        } as ImagePayload,
      };

    case EngagementType.MESSAGE:
      return {
        ...base,
        payload: {
          message: "",
          ...base.payload,
        } as MessagePayload,
      };

    default:
      throw new Error(`Unsupported engagement type: ${template.type}`);
  }
}

export default async function getEngagementTemplates(): Promise<EngagementTemplate[]> {
  const templates = await prisma.engagementTemplate.findMany({});
  return templates.map(normalizeTemplatePayload);
}
