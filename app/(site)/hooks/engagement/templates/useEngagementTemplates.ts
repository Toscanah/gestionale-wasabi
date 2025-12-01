import uploadImage from "@/app/(site)/lib/integrations/images/uploadImage";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { ParsedEngagementPayload, EngagementContracts } from "@/app/(site)/lib/shared";
import { EngagementType } from "@/prisma/generated/client/enums";
import { useState } from "react";
import { trpc } from "@/lib/server/client";

export const EMPTY_PAYLOADS: Record<EngagementType, ParsedEngagementPayload> = {
  QR_CODE: { url: "", textAbove: "", textBelow: "" },
  IMAGE: { imageUrl: "", textAbove: "", textBelow: "" },
  MESSAGE: { message: "", textAbove: "", textBelow: "" },
};

type TemplatePayloadDraft = EngagementContracts.TemplatePayloadDraft;

const createEmptyDraft = (type: EngagementType): TemplatePayloadDraft => ({
  type,
  label: "",
  payload: EMPTY_PAYLOADS[type],
  selectedImage: type === EngagementType.IMAGE ? null : undefined,
  redeemable: false,
});

export default function useEngagementTemplates() {
  const utils = trpc.useUtils();

  const [draftTemplate, setDraftTemplate] = useState<TemplatePayloadDraft>(() =>
    createEmptyDraft(EngagementType.QR_CODE)
  );

  const { data: templates = [], isLoading } = trpc.engagements.getTemplates.useQuery();

  const createMutation = trpc.engagements.createTemplate.useMutation({
    onSuccess: (created) => {
      utils.engagements.getTemplates.setData(undefined, (old) =>
        old ? [...old, created] : [created]
      );
      toastSuccess("Modello creato con successo");
    },
  });

  const updateMutation = trpc.engagements.updateTemplate.useMutation({
    onSuccess: (updated) => {
      utils.engagements.getTemplates.setData(undefined, (old) =>
        old ? old.map((t) => (t.id === updated.id ? updated : t)) : [updated]
      );
      toastSuccess("Modello aggiornato con successo");
    },
  });

  const deleteMutation = trpc.engagements.deleteTemplateById.useMutation({
    onSuccess: ({ id: templateId }) => {
      utils.engagements.getTemplates.setData(undefined, (old) =>
        old ? old.filter((t) => t.id !== templateId) : []
      );
      toastSuccess("Modello eliminato con successo");
    },
  });

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

  const updateTemplate = async (template: EngagementContracts.UpdateTemplate.Input) => {
    const finalPayload = await maybeUploadImage(template.payload, template.selectedImage);

    await updateMutation.mutateAsync({
      id: template.id,
      label: template.label,
      redeemable: template.redeemable,
      payload: finalPayload,
    });
  };

  const createTemplate = async (draft: TemplatePayloadDraft) => {
    const finalPayload = await maybeUploadImage(draft.payload, draft.selectedImage);

    const newTemplate: EngagementContracts.CreateTemplate.Input = {
      type: draft.type,
      label: draft.label ?? "",
      payload: finalPayload,
      redeemable: draft.redeemable,
    };

    await createMutation.mutateAsync(newTemplate);
    setDraftTemplate(() => createEmptyDraft(EngagementType.QR_CODE));
  };

  const deleteTemplate = async (templateId: number) => {
    await deleteMutation.mutateAsync({ templateId });
  };

  const resetDraftTemplate = (newType: EngagementType) =>
    setDraftTemplate(() => createEmptyDraft(newType));


  return {
    isLoading,
    templates,
    updateTemplate,
    draftTemplate,
    setDraftTemplate,
    createTemplate,
    deleteTemplate,
    resetDraftTemplate,
  };
}
