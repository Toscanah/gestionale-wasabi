import { ParsedEngagementTemplate } from "@/app/(site)/lib/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TemplateWrapper from "../TemplateWrapper";
import getTemplateName from "@/app/(site)/lib/utils/domains/engagement/getTemplateName";
import { Button } from "@/components/ui/button";
import { Trash } from "@phosphor-icons/react";
import renderByType from "../../types/renderByType";

type ViewModeProps = {
  index: number;
  template: ParsedEngagementTemplate;
};

export default function TemplateContentView({ index, template }: ViewModeProps) {
  const { type, label, payload } = template;

  return (
    <>
      <AccordionItem value={`view-${index}`} className="w-full">
        <AccordionTrigger>
          <div className="w-full flex justify-start">
            #{index + 1} - {label?.length ? label : "Nessuna etichetta"} ({getTemplateName(type)})
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
    </>
  );
}
