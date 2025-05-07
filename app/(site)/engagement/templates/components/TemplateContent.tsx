import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/templates/getTemplateName";
import {
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
};

// Edit mode props
type TemplateContentViewModeProps = CommonPayloadProps & {
  mode: "edit";
  template: EngagementTemplate;
  onChange: (updatedTemplate: DraftUpdateEngagementTemplate) => void;
  onSave: (template: DraftUpdateEngagementTemplate) => Promise<void>;
};

// Create mode props
type TemplateContentCreateModeProps = CommonPayloadProps & {
  mode: "create";
  draftTemplate: DraftCreateEngagementTemplate;
  onChange: (updatedDraft: DraftCreateEngagementTemplate) => void;
  onCreate: (newTemplate: DraftCreateEngagementTemplate) => Promise<void>;
};

export type TemplateContentProps = TemplateContentViewModeProps | TemplateContentCreateModeProps;

export default function TemplateContent(props: TemplateContentProps) {
  const type = props.mode === "edit" ? props.template.type : props.draftTemplate.type;
  const payload =
    props.mode === "edit"
      ? (props.template.payload as DraftEngagementTemplatePayload)
      : props.draftTemplate.payload;

  const { textAbove = "Nessuno", textBelow = "Nessuno" } = payload || {};

  const handleChange = (updated: DraftEngagementTemplatePayload) => {
    const currentPayload: DraftEngagementTemplatePayload =
      props.mode === "edit"
        ? (props.template.payload as DraftEngagementTemplatePayload)
        : props.draftTemplate.payload;

    const mergedPayload = {
      ...currentPayload,
      ...updated,
    };

    if (props.mode === "edit") {
      props.onChange({
        ...props.template,
        payload: mergedPayload,
      });
    } else {
      props.onChange({
        ...props.draftTemplate,
        payload: mergedPayload,
      } as DraftCreateEngagementTemplate);
    }
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
          onChange={(newType: EngagementType) => {
            if (props.mode === "create") {
              props.onChange({
                label: props.draftTemplate.label,
                type: newType,
                payload: {},
              } as DraftCreateEngagementTemplate);
            }
          }}
        />

        <TemplateWrapper
          onTextAboveChange={(text) => handleChange({ ...payload, textAbove: text })}
          onTextBelowChange={(text) => handleChange({ ...payload, textBelow: text })}
          onSubmit={async () => {
            if (props.mode === "edit") {
              props.onSave({
                id: props.template.id,
                label: props.template.label,
                payload,
              });
            } else {
              props.onCreate({
                type,
                label: props.draftTemplate.label,
                payload,
              } as DraftCreateEngagementTemplate);
            }
          }}
          textAbove={textAbove}
          textBelow={textBelow}
          templateComponent={
            type === EngagementType.QR_CODE ? (
              <QRCode
                value={(payload as QrPayload).url}
                onChange={(url) => handleChange({ url })}
              />
            ) : type === EngagementType.IMAGE ? (
              <Image
                value={"imageUrl" in payload ? (payload.imageUrl as string) : ""}
                onChange={(imageFile) => handleChange({ imageFile })}
              />
            ) : (
              <Message
                value={(payload as MessagePayload).message}
                onChange={(message) => handleChange({ message })}
              />
            )
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
}
