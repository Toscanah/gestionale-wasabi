import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import uploadImage from "@/app/(site)/lib/api/uploadImage";
import { toastSuccess } from "@/app/(site)/lib/util/toast";
import {
  DraftEngagementTemplatePayload,
  DraftImagePayload,
  DraftUpdateEngagementTemplate,
  FinalImagePayload,
  FinalUpdateEngagementTemplate,
  DraftCreateEngagementTemplate,
  FinalCreateEngagementTemplate,
  MessagePayload,
  QrPayload,
  FinalEngagementPayload,
} from "@/app/(site)/shared";
import { EngagementTemplate, EngagementType } from "@prisma/client";
import { useEffect, useState } from "react";

const EMPTY_DRAFT: DraftCreateEngagementTemplate = {
  type: EngagementType.QR_CODE,
  label: "",
  payload: {
    textAbove: "",
    textBelow: "",
    url: "",
  },
};

export default function useMarketingTemplates() {
  const [templates, setTemplates] = useState<EngagementTemplate[]>([]);
  const [draftTemplate, setDraftTemplate] = useState<DraftCreateEngagementTemplate>(EMPTY_DRAFT);

  const fetchTemplates = () =>
    fetchRequest<EngagementTemplate[]>("GET", "/api/engagements", "getEngagementTemplates").then(
      setTemplates
    );

  async function buildPayload(
    type: EngagementType,
    payload: DraftEngagementTemplatePayload
  ): Promise<FinalEngagementPayload> {
    switch (type) {
      case EngagementType.QR_CODE:
        return {
          url: (payload as QrPayload).url,
          textAbove: payload.textAbove,
          textBelow: payload.textBelow,
        };

      case EngagementType.IMAGE: {
        const { imageFile, textAbove, textBelow } = payload as DraftImagePayload;
        const { path: imageUrl } = await uploadImage(imageFile, "engagements");

        const finalPayload: FinalImagePayload = {
          imageUrl,
          textAbove,
          textBelow,
        };

        return finalPayload;
      }

      case EngagementType.MESSAGE:
        return {
          message: (payload as MessagePayload).message,
          textAbove: payload.textAbove,
          textBelow: payload.textBelow,
        };

      default:
        throw new Error(`Unsupported engagement type: ${type}`);
    }
  }

  const updateTemplate = async (template: DraftUpdateEngagementTemplate) => {
    const templateType = templates.find((t) => t.id == template.id)?.type;
    if (!templateType) {
      throw new Error(`Template with id ${template.id} not found`);
    }
    const finalPayload = await buildPayload(templateType, template.payload);

    const finalTemplate: FinalUpdateEngagementTemplate = {
      ...template,
      payload: finalPayload,
    };
    // Send update
    fetchRequest<EngagementTemplate>("PATCH", "/api/engagements", "updateEngagementTemplate", {
      ...finalTemplate,
    }).then((updatedTemplate) =>
      setTemplates((prev) => prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    );
  };

  const createTemplate = async (newTemplate: DraftCreateEngagementTemplate) => {
    const finalPayload = await buildPayload(newTemplate.type, newTemplate.payload);

    const finalTemplate = {
      type: newTemplate.type,
      label: newTemplate.label,
      payload: finalPayload,
    } as FinalCreateEngagementTemplate;

    fetchRequest<EngagementTemplate>("POST", "/api/engagements", "createEngagementTemplate", {
      ...finalTemplate,
    }).then((createdTemplate) => {
      setTemplates((prev) => [...prev, createdTemplate]);
      setDraftPayload(undefined);
      toastSuccess("Modello creato con successo");
    });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    setTemplates,
    updateTemplate,
    draftTemplate,
    setDraftTemplate,
    createTemplate,
  };
}
