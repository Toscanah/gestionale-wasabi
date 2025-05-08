import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import uploadImage from "@/app/(site)/lib/api/uploadImage";
import { toastSuccess } from "@/app/(site)/lib/util/toast";
import {
  ParsedEngagementTemplate,
  UpdateEngagementTemplate,
  CreateEngagementTemplate,
  ParsedEngagementPayload,
  TemplatePayloadDraft,
} from "@/app/(site)/shared";
import { EngagementType } from "@prisma/client";
import { useEffect, useState } from "react";

const EMPTY_DRAFT: TemplatePayloadDraft = {
  type: EngagementType.QR_CODE,
  label: "",
  payload: {
    textAbove: "",
    textBelow: "",
    url: "",
  },
  selectedImage: null,
};

export default function useEngagementTemplates() {
  const [templates, setTemplates] = useState<ParsedEngagementTemplate[]>([]);
  const [draftTemplate, setDraftTemplate] = useState<TemplatePayloadDraft>(EMPTY_DRAFT);

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

    console.log(templates)

    console.log("Updating template", template, payload);

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

    console.log("Creating template", newTemplate);

    fetchRequest<ParsedEngagementTemplate>("POST", "/api/engagements", "createEngagementTemplate", {
      ...newTemplate,
    }).then((created) => {
      setTemplates((prev) => [...prev, created]);
      setDraftTemplate(EMPTY_DRAFT);
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
