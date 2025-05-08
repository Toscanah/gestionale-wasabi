import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/templates/getTemplateName";
import {
  CreateEngagementTemplate,
  ParsedEngagementTemplate,
  ParsedEngagementPayload,
  QrPayload,
  MessagePayload,
  ImagePayload,
  TemplatePayloadDraft,
  UpdateEngagementTemplate,
  CommonPayload,
} from "@/app/(site)/shared";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EngagementType } from "@prisma/client";
import TemplateWrapper from "../../TemplateWrapper";
import QRCode from "../types/QRCode";
import Message from "../types/Message";
import Image from "../types/Image";
import TemplateTypeSelector from "./TemplateTypeSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CommonProps = {
  index: number;
};

// Edit mode
type ViewModeProps = CommonProps & {
  mode: "edit";
  template: ParsedEngagementTemplate;
  onChange: (updates: Partial<UpdateEngagementTemplate>) => void;
  onSave: (template: ParsedEngagementTemplate) => Promise<void>;
};

// Create mode
type CreateModeProps = CommonProps & {
  mode: "create";
  draftTemplate: TemplatePayloadDraft;
  onChange: (updates: Partial<CreateEngagementTemplate>) => void;
  onCreate: (template: TemplatePayloadDraft) => Promise<void>;
};

export type TemplateContentProps = ViewModeProps | CreateModeProps;

export default function TemplateContent(props: TemplateContentProps) {
  const isEdit = props.mode === "edit";

  const template = isEdit ? props.template : props.draftTemplate;
  const type = template.type;
  const currentPayload = template.payload as ParsedEngagementPayload;
  const { textAbove = "", textBelow = "" }: CommonPayload = currentPayload;

  const handlePayloadChange = (updated: Partial<ParsedEngagementPayload>) => {
    switch (type) {
      case EngagementType.QR_CODE:
        return props.onChange({ type: EngagementType.QR_CODE, payload: updated as QrPayload });
      case EngagementType.IMAGE:
        return props.onChange({ type: EngagementType.IMAGE, payload: updated as ImagePayload });
      case EngagementType.MESSAGE:
        return props.onChange({ type: EngagementType.MESSAGE, payload: updated as MessagePayload });
      default:
        break;
    }
  };

  return (
    <AccordionItem value={isEdit ? `active-${props.index}` : `create-${props.index}`}>
      <AccordionTrigger>
        {isEdit ? (
          <>
            #{props.index + 1} - {template.label ?? "Nessuna etichetta"} ({getTemplateName(type)})
          </>
        ) : (
          <>Crea nuovo modello ({getTemplateName(type)})</>
        )}
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-4">
        {!isEdit && (
          <TemplateTypeSelector
            selectedType={type}
            onChange={(newType) => {
              switch (newType) {
                case EngagementType.QR_CODE:
                  return props.onChange({
                    type: newType,
                    payload: {} as QrPayload,
                  });

                case EngagementType.IMAGE:
                  return props.onChange({
                    type: newType,
                    payload: {} as ImagePayload,
                  });

                case EngagementType.MESSAGE:
                  return props.onChange({
                    type: newType,
                    payload: {} as MessagePayload,
                  });
              }
            }}
          />
        )}

        <div className="flex flex-col space-y-2">
          <Label htmlFor={"label" + props.index}>Etichetta</Label>
          <Input
            defaultValue={template.label ?? ""}
            onChange={(e) => props.onChange({ label: e.target.value })}
          />
        </div>

        <TemplateWrapper
          textAbove={textAbove}
          textBelow={textBelow}
          onTextAboveChange={(textAbove) => handlePayloadChange({ textAbove })}
          onTextBelowChange={(textBelow) => handlePayloadChange({ textBelow })}
          onSubmit={async () => {
            if (isEdit) {
              await props.onSave(template as ParsedEngagementTemplate);
            } else {
              await props.onCreate(template as TemplatePayloadDraft);
            }
          }}
          templateComponent={
            type === EngagementType.QR_CODE ? (
              <QRCode
                value={(currentPayload as QrPayload).url}
                onChange={(url) => handlePayloadChange({ url })}
              />
            ) : type === EngagementType.IMAGE ? (
              <Image
                value={(currentPayload as ImagePayload).imageUrl}
                onChange={(selectedImage) => props.onChange({ selectedImage })}
              />
            ) : (
              <Message
                value={(currentPayload as MessagePayload).message}
                onChange={(message) => handlePayloadChange({ message })}
              />
            )
          }
        />
      </AccordionContent>
    </AccordionItem>
  );
}
