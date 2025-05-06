import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/templates/getTemplateName";
import {
  CommonPayload,
  FinalCreateEngagementTemplate,
  DraftEngagementTemplatePayload,
  DraftUpdateEngagementTemplate,
  FinalImagePayload,
  MessagePayload,
  QrPayload,
  DraftCreateEngagementTemplate,
} from "@/app/(site)/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EngagementTemplate, EngagementType } from "@prisma/client";
import TemplateWrapper from "../../TemplateWrapper";
import QRCode from "../types/QRCode";
import Message from "../types/Message";
import Image from "../types/Image";
import TemplateTypeSelector from "./TemplateTypeSelector";

type CommonPayloadProps = {
  index: number;
  onChange: (newPayload: DraftEngagementTemplatePayload) => void;
};

// Edit mode props
type TemplatePayloadViewModeProps = CommonPayloadProps & {
  mode: "edit";
  template: EngagementTemplate;
  onSave: (updatedTemplate: DraftUpdateEngagementTemplate) => Promise<void>;
};

// Create mode props
type TemplatePayloadCreateModeProps = CommonPayloadProps & {
  mode: "create";
  index: number;
  selectedType: EngagementType;
  setSelectedType: (type: EngagementType) => void;
  draftPayload: DraftEngagementTemplatePayload | undefined;
  onCreate: (newTemplate: DraftCreateEngagementTemplate) => Promise<void>;
};

export type TemplatePayloadProps = TemplatePayloadViewModeProps | TemplatePayloadCreateModeProps;

export default function TemplatePayload(props: TemplatePayloadProps) {
  const type = props.mode === "edit" ? props.template.type : props.selectedType;
  const payload =
    props.mode === "edit" ? (props.template.payload as CommonPayload) : props.draftPayload;

  const { textAbove = "Nessuno", textBelow = "Nessuno" } = payload || {};

  const handleChange = (updated: DraftEngagementTemplatePayload) => {
    const currentPayload =
      props.mode === "edit"
        ? (props.template.payload as DraftEngagementTemplatePayload)
        : props.draftPayload ?? {};

    props.onChange({
      ...currentPayload,
      ...updated,
    });
  };

  return (
    <AccordionItem
      value={props.mode === "edit" ? `active-${props.index}` : `create-${props.index}`}
    >
      <AccordionTrigger>
        {props.mode === "edit" ? (
          <>
            #{props.index + 1} - {props.template.label ?? "Nessuna etichetta"} (
            {getTemplateName(type)})
          </>
        ) : (
          <>Crea nuovo modello ({getTemplateName(type)})</>
        )}
      </AccordionTrigger>

      <AccordionContent>
        <TemplateTypeSelector
          disabled={props.mode === "edit"}
          selectedType={type}
          onChange={(newType) => {
            if (props.mode === "create") {
              props.setSelectedType(newType);
            }
          }}
        />

        <TemplateWrapper
          onSave={props.onSave}
          textAbove={textAbove}
          textBelow={textBelow}
          templateComponent={
            type === EngagementType.QR_CODE ? (
              <QRCode
                value={(payload as QrPayload)?.url}
                onChange={(url) => handleChange({ url })}
              />
            ) : type === EngagementType.IMAGE ? (
              <Image
                value={(payload as FinalImagePayload)?.imageUrl}
                onChange={(imageUrl) => handleChange({ imageUrl })}
              />
            ) : (
              <Message
                value={(payload as MessagePayload)?.message}
                onChange={(message) => handleChange({ message })}
              />
            )
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
}
