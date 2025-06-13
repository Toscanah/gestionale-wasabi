import { ParsedEngagementTemplate } from "@/app/(site)/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TemplateWrapper from "../TemplateWrapper";
import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/getTemplateName";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import renderByType from "../../types/renderByType";

type ViewModeProps = {
  index: number;
  onDelete: (engagementId: number) => Promise<void>;
  template: ParsedEngagementTemplate;
};

export default function TemplateContentView({ index, template, onDelete }: ViewModeProps) {
  const { type, payload, label, id } = template;

  return (
    <>
      <AccordionItem value={`view-${index}`} className="w-full">
        <AccordionTrigger>
          <div className="w-full flex justify-start">
            #{index + 1} - {label ?? "Nessuna etichetta"} ({getTemplateName(type)})
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4">
          <TemplateWrapper
            textAbove={payload.textAbove}
            textBelow={payload.textBelow}
            disabled
            templateComponent={renderByType(type, payload, () => {}, true)}
          />
        </AccordionContent>
      </AccordionItem>

      <Button onClick={() => onDelete(id)} className="mr-2">
        <Trash size={24} />
      </Button>
    </>
  );
}
