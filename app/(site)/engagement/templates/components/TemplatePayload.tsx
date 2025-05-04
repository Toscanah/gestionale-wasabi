import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/templates/getTemplateName";
import { CommonPayload, FinalImagePayload, MessagePayload, QrPayload } from "@/app/(site)/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EngagementTemplate, EngagementType } from "@prisma/client";
import Image from "next/image";
import TemplateWrapper from "../../TemplateWrapper";

interface TemplatePayloadViewModeProps {
  mode: "edit";
  template: EngagementTemplate;
  onUpdate: (newPayload: Template) => void;
}

// For creating a new template
interface TemplatePayloadCreateModeProps {
  mode: "create";
  type: EngagementType;
  payload: Partial<TemplatePayload>;
  setPayload: (newPayload: Partial<TemplatePayload>) => void;
}

// Unified type
export type TemplatePayloadProps = undefn
  // | TemplatePayloadViewModeProps
  // | TemplatePayloadCreateModeProps;

export default function TemplatePayload({  }: TemplatePayloadProps) {
  const { payload, type } = template;
  const { textAbove = "Nessuno", textBelow = "Nessuno" } = payload as CommonPayload;
  const url = (payload as QrPayload)?.url;
  const imageUrl = (payload as FinalImagePayload)?.imageUrl;
  const message = (payload as MessagePayload)?.message;

  return (
    <AccordionItem key={template.id} value={`active-${index}`}>
      <AccordionTrigger>
        #{index + 1} - {template?.label ?? "Nessuna etichetta"} ({getTemplateName(template.type)})
      </AccordionTrigger>

      <AccordionContent>
        <TemplateWrapper templateComponent={choice === EngagementType.QR_CODE ? (
            <QRCode onChange={(value) => setPayload((prev) => ({ ...prev, url: value }))} />
          ) : choice === EngagementType.IMAGE ? (
            <Image onChange={(file) => setPayload((prev) => ({ ...prev, imageFile: file }))} />
          ) : (
            <Message onChange={(value) => setPayload((prev) => ({ ...prev, message: value }))} />
          )}}
      </AccordionContent>
    </AccordionItem>
  );
}
