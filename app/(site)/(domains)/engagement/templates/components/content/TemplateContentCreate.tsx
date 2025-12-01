import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TemplateTypeSelector from "../TemplateTypeSelector";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TemplateWrapper from "../TemplateWrapper";
import { EngagementContracts, ParsedEngagementPayload } from "@/app/(site)/lib/shared";
import renderByType from "../../types/renderByType";
import { EngagementType } from "@/prisma/generated/client/enums";

type TemplatePayloadDraft = EngagementContracts.TemplatePayloadDraft;

type CreateTemplateWithImage = EngagementContracts.CreateTemplate.Input & {
  selectedImage?: TemplatePayloadDraft["selectedImage"];
};

type CreateModeProps = {
  index: number;
  draftTemplate: TemplatePayloadDraft;
  onChange: (updates: Partial<CreateTemplateWithImage>) => void;
  onCreate: (template: TemplatePayloadDraft) => Promise<void>;
  onTypeChange: (newType: EngagementType) => void;
};

export default function TemplateContentCreate({
  index,
  draftTemplate,
  onChange,
  onCreate,
  onTypeChange,
}: CreateModeProps) {
  const { type, payload, label } = draftTemplate;

  const updatePayload = (newValues: Partial<ParsedEngagementPayload>) => {
    onChange({
      type,
      payload: { ...payload, ...newValues },
    });
  };

  const updateField = (field: keyof ParsedEngagementPayload, value: string) => {
    updatePayload({ [field]: value });
  };

  const handleLabelChange = (value: string) => {
    onChange({ label: value });
  };

  const handleRedeemableChange = (value: boolean) => {
    onChange({ redeemable: value });
  };

  const handleTemplateComponentChange = (
    patch: Partial<ParsedEngagementPayload> | { selectedImage: File | null }
  ) => {
    if ("selectedImage" in patch) {
      onChange({ selectedImage: patch.selectedImage });
    } else {
      updatePayload(patch);
    }
  };

  return (
    <AccordionItem value={`create-${index}`} className="w-full">
      <AccordionTrigger>
        <div className="w-full flex justify-start">Crea nuovo modello</div>
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-4">
        <TemplateTypeSelector selectedType={type} onChange={onTypeChange} />

        <div className="flex flex-col space-y-2">
          <Label htmlFor={`label-${index}`}>Etichetta</Label>
          <Input
            id={`label-${index}`}
            value={label ?? ""}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>

        <TemplateWrapper
          textAbove={payload.textAbove}
          textBelow={payload.textBelow}
          onTextAboveChange={(val) => updateField("textAbove", val)}
          onTextBelowChange={(val) => updateField("textBelow", val)}
          onRedeemableChange={handleRedeemableChange}
          onSubmit={() => onCreate(draftTemplate)}
          templateComponent={renderByType(type, payload, handleTemplateComponentChange)}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
