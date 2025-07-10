import fetchRequest from "@/app/(site)/lib/core/fetchRequest";
import uploadImage from "@/app/(site)/lib/integrations/images/uploadImage";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import {
  ParsedEngagementTemplate,
  UpdateEngagementTemplate,
  CreateEngagementTemplate,
  ParsedEngagementPayload,
  TemplatePayloadDraft,
} from "@/app/(site)/lib/shared";
import { EngagementType } from "@prisma/client";
import { useEffect, useState } from "react";

export const EMPTY_PAYLOADS: Record<EngagementType, ParsedEngagementPayload> = {
  QR_CODE: { url: "", textAbove: "", textBelow: "" },
  IMAGE: { imageUrl: "", textAbove: "", textBelow: "" },
  MESSAGE: { message: "", textAbove: "", textBelow: "" },
};

const createEmptyDraft = (type: EngagementType): TemplatePayloadDraft => ({
  type,
  label: "",
  payload: EMPTY_PAYLOADS[type],
  selectedImage: type === EngagementType.IMAGE ? null : undefined,
});

export default function useEngagementTemplates() {
  const [templates, setTemplates] = useState<ParsedEngagementTemplate[]>([]);
  const [draftTemplate, setDraftTemplate] = useState<TemplatePayloadDraft>(() =>
    createEmptyDraft(EngagementType.QR_CODE)
  );

  const fetchTemplates = () =>
    fetchRequest<ParsedEngagementTemplate[]>(
      "GET",
      "/api/engagements",
      "getEngagementTemplates"
    ).then(setTemplates);

  const maybeUploadImage = async (
    payload: ParsedEngagementPayload,
    selectedFile?: TemplatePayloadDraft["selectedImage"]
  ): Promise<ParsedEngagementPayload> => {
    if (selectedFile) {
      const { path: imageUrl } = await uploadImage(selectedFile, "engagements");
      return { ...payload, imageUrl };
    }

    return payload;
  };

  const updateTemplate = async (template: UpdateEngagementTemplate) => {
    const payload = await maybeUploadImage(template.payload, template.selectedImage);

    fetchRequest<ParsedEngagementTemplate>(
      "PATCH",
      "/api/engagements",
      "updateEngagementTemplate",
      {
        id: template.id,
        label: template.label,
        payload,
      }
    ).then((updated) => {
      setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toastSuccess("Modello aggiornato con successo");
    });
  };

  const createTemplate = async (draft: TemplatePayloadDraft) => {
    const finalPayload = await maybeUploadImage(draft.payload, draft.selectedImage);

    const newTemplate: CreateEngagementTemplate = {
      type: draft.type,
      label: draft.label ?? "",
      payload: finalPayload as ParsedEngagementPayload,
    } as CreateEngagementTemplate;

    fetchRequest<ParsedEngagementTemplate>("POST", "/api/engagements", "createEngagementTemplate", {
      ...newTemplate,
    }).then((created) => {
      setTemplates((prev) => [...prev, created]);
      setDraftTemplate(() => createEmptyDraft(EngagementType.QR_CODE));
      toastSuccess("Modello creato con successo");
    });
  };

  const deleteTemplate = async (templateId: number) =>
    fetchRequest<number>("DELETE", "/api/engagements", "deleteTemplateById", { templateId }).then(
      () => toastSuccess("Modello eliminato con successo")
    );

  const resetDraftTemplate = (newType: EngagementType) =>
    setDraftTemplate(() => createEmptyDraft(newType));

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
    deleteTemplate,
    resetDraftTemplate,
  };
}
