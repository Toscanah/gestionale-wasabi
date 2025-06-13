import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TemplateTypeSelector from "../TemplateTypeSelector";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TemplateWrapper from "../TemplateWrapper";
import {
  CreateEngagementTemplate,
  ParsedEngagementPayload,
  TemplatePayloadDraft,
} from "@/app/(site)/shared";
import renderByType from "../../types/renderByType";
import { EngagementType } from "@prisma/client";

type CreateTemplateWithImage = CreateEngagementTemplate & {
  selectedImage?: TemplatePayloadDraft["selectedImage"];
};

type CreateModeProps = {
  index: number;
  draftTemplate: TemplatePayloadDraft;
  onChange: (updates: Partial<CreateTemplateWithImage>) => void;
  onCreate: (template: TemplatePayloadDraft) => Promise<void>;
};

const EMPTY_PAYLOADS: Record<EngagementType, ParsedEngagementPayload> = {
  QR_CODE: { url: "", textAbove: "", textBelow: "" },
  IMAGE: { imageUrl: "", textAbove: "", textBelow: "" },
  MESSAGE: { message: "", textAbove: "", textBelow: "" },
};

export default function TemplateContentCreate({
  index,
  draftTemplate,
  onChange,
  onCreate,
}: CreateModeProps) {
  const { type, payload, label } = draftTemplate;

  const handleTemplateChange = (updates: Partial<CreateTemplateWithImage>) => {
    if (type === EngagementType.IMAGE && "selectedImage" in updates) {
      onChange(updates);
    } else {
      handlePayloadChange(updates.payload );
    }
  };

  const handlePayloadChange = (updates: Partial<CreateEngagementTemplate>) =>
    onChange({
      type,
      payload: {
        ...payload,
        ...updates,
      } as any,
    });

  return (
    <AccordionItem value={`create-${index}`} className="w-full">
      <AccordionTrigger>
        <div className="w-full flex justify-start">Crea nuovo modello</div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <TemplateTypeSelector
          selectedType={type}
          onChange={(newType) =>
            onChange({
              type: newType,
              payload: EMPTY_PAYLOADS[newType] as any,
            })
          }
        />

        <Label htmlFor={`label-${index}`}>Etichetta</Label>
        <Input defaultValue={label ?? ""} onChange={(e) => onChange({ label: e.target.value })} />

        <TemplateWrapper
          textAbove={payload.textAbove}
          textBelow={payload.textBelow}
          onTextAboveChange={(val) => handleTemplateChange({ payload: { textAbove: val } })}
          onTextBelowChange={(val) => handleTemplateChange({ payload: { textBelow: val } })}
          onSubmit={() => onCreate(draftTemplate)}
          templateComponent={renderByType(type, payload, handlePayloadChange)}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
