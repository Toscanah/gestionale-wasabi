import {
  EngagementContracts,
  ParsedEngagementPayload,
  ParsedEngagementTemplate,
} from "@/lib/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TemplateWrapper from "../TemplateWrapper";
import getTemplateName from "@/lib/shared/utils/domains/engagement/getTemplateName";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import renderByType from "../../types/renderByType";

type EditModeProps = {
  index: number;
  template: ParsedEngagementTemplate;
  onChange: (updates: Partial<EngagementContracts.TemplatePayloadDraft>) => void;
  onDelete: (templateId: number) => Promise<void>;
  onSave: (template: ParsedEngagementTemplate) => Promise<void>;
};

export default function TemplateContentEdit({
  index,
  template,
  onChange,
  onSave,
  onDelete,
}: EditModeProps) {
  const { id, type, label, payload, redeemable: isRedeemable } = template;

  const updatePayload = (updates: Partial<ParsedEngagementPayload>) => {
    onChange({
      payload: { ...payload, ...updates },
    });
  };

  const handleLabelChange = (value: string) => {
    onChange({ label: value });
  };

  const handleRedeemableChange = (value: boolean) => {
    onChange({ redeemable: value });
  };

  const handleComponentChange = (
    patch: Partial<ParsedEngagementPayload> | { selectedImage: File | null }
  ) => {
    if ("selectedImage" in patch) {
      onChange({ selectedImage: patch.selectedImage });
    } else {
      updatePayload(patch as Partial<ParsedEngagementPayload>);
    }
  };

  return (
    <>
      <AccordionItem value={`edit-${index}`} className="w-full">
        <AccordionTrigger>
          <div className="w-full flex justify-start">
            #{index + 1} - {label?.length ? label : "Nessuna etichetta"} ({getTemplateName(type)})
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor={`label-${index}`}>Etichetta</Label>
            <Input
              id={`label-${index}`}
              defaultValue={label ?? ""}
              onChange={(e) => handleLabelChange(e.target.value)}
            />
          </div>

          <TemplateWrapper
            textAbove={payload.textAbove}
            textBelow={payload.textBelow}
            isRedeemable={isRedeemable}
            onRedeemableChange={handleRedeemableChange}
            onTextAboveChange={(val) => updatePayload({ textAbove: val })}
            onTextBelowChange={(val) => updatePayload({ textBelow: val })}
            onSubmit={() => onSave(template)}
            templateComponent={renderByType(type, payload, handleComponentChange)}
          />
        </AccordionContent>
      </AccordionItem>

      <Button onClick={() => onDelete(id)} className="mr-2">
        <Trash size={24} />
      </Button>
    </>
  );
}
