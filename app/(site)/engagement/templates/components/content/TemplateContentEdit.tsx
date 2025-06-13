import {
  CreateEngagementTemplate,
  ParsedEngagementPayload,
  ParsedEngagementTemplate,
  UpdateEngagementTemplate,
} from "@/app/(site)/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TemplateWrapper from "../TemplateWrapper";
import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/getTemplateName";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import renderByType from "../../types/renderByType";
import { EngagementType } from "@prisma/client";

type EditModeProps = {
  index: number;
  template: ParsedEngagementTemplate;
  onChange: (updates: Partial<UpdateEngagementTemplate>) => void;
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
  const { type, payload, label, id } = template;

  const handlePayloadChange = (updates: Partial<ParsedEngagementPayload>) => {
    onChange({
      payload: { ...payload, ...updates } as any,
    });
  };

  return (
    <>
      <AccordionItem value={`edit-${index}`} className="w-full">
        <AccordionTrigger>
          <div className="w-full flex justify-start">
            #{index + 1} - {label ?? "Nessuna etichetta"} ({getTemplateName(type)})
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4">
          <Label htmlFor={`label-${index}`}>Etichetta</Label>
          <Input defaultValue={label ?? ""} onChange={(e) => onChange({ label: e.target.value })} />

          <TemplateWrapper
            textAbove={payload.textAbove}
            textBelow={payload.textBelow}
            onTextAboveChange={(val) => handlePayloadChange({ textAbove: val })}
            onTextBelowChange={(val) => handlePayloadChange({ textBelow: val })}
            onSubmit={() => onSave(template)}
            templateComponent={renderByType(type, payload, handlePayloadChange)}
          />
        </AccordionContent>
      </AccordionItem>

      <Button onClick={() => onDelete(id)} className="mr-2">
        <Trash size={24} />
      </Button>
    </>
  );
}
