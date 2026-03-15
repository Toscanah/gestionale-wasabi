import {
  ENGAGEMENT_TYPES_COLORS,
  ENGAGEMENT_TYPES_LABELS,
  ParsedEngagementTemplate,
} from "@/lib/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TemplateWrapper from "../TemplateWrapper";
import renderByType from "../../types/renderByType";
import { Badge } from "@/components/ui/badge";

type ViewModeProps = {
  index: number;
  template: ParsedEngagementTemplate;
};

export default function TemplateContentView({ index, template }: ViewModeProps) {
  const { type, label, payload, redeemable: isRedeemable } = template;

  return (
    <>
      <AccordionItem value={`view-${index}`} className="w-full">
        <AccordionTrigger>
          <div className="w-full flex justify-start gap-2">
            #{index + 1} -{" "}
            {label?.length ? label : "Nessuna etichetta"}
            <Badge className={ENGAGEMENT_TYPES_COLORS[type]}>{ENGAGEMENT_TYPES_LABELS[type]}</Badge>
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4">
          <TemplateWrapper
            textAbove={payload.textAbove}
            textBelow={payload.textBelow}
            isRedeemable={isRedeemable}
            disabled
            templateComponent={renderByType(type, payload, () => {}, true)}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
