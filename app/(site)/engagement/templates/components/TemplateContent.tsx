import getTemplateName from "@/app/(site)/lib/formatting-parsing/engagement/getTemplateName";
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
import TemplateWrapper from "../TemplateWrapper";
import QRCode from "../types/QRCode";
import Message from "../types/Message";
import Image from "../types/Image";
import TemplateTypeSelector from "./TemplateTypeSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type CommonProps = {
  index: number;
};

type ViewModeProps = CommonProps & {
  disabled: true;
  mode: "view";
  onDelete: (engagementId: number) => Promise<void>;
  template: ParsedEngagementTemplate;
};

// Edit mode
type EditModeProps = CommonProps & {
  disabled?: false;
  mode: "edit";
  template: ParsedEngagementTemplate;
  onChange: (updates: Partial<UpdateEngagementTemplate>) => void;
  onDelete: (templateId: number) => Promise<void>;
  onSave: (template: ParsedEngagementTemplate) => Promise<void>;
};

// Create mode
type CreateModeProps = CommonProps & {
  disabled?: false;
  mode: "create";
  draftTemplate: TemplatePayloadDraft;
  onChange: (updates: Partial<CreateEngagementTemplate>) => void;
  onCreate: (template: TemplatePayloadDraft) => Promise<void>;
};

export type TemplateContentProps = EditModeProps | CreateModeProps | ViewModeProps;

export default function TemplateContent(props: TemplateContentProps) {
  const isEdit = props.mode === "edit";
  const isCreate = props.mode === "create";
  const isView = props.mode === "view";
  const disabled = props.disabled ?? false;

  const template = isEdit || isView ? props.template : props.draftTemplate;
  const type = template.type;
  const currentPayload = template.payload as ParsedEngagementPayload;
  const { textAbove = "", textBelow = "" }: CommonPayload = currentPayload;

  const handlePayloadChange = (updated: Partial<ParsedEngagementPayload>) => {
    if (isView) return;

    switch (type) {
      case EngagementType.QR_CODE:
        return props.onChange?.({
          type: EngagementType.QR_CODE,
          payload: updated as QrPayload,
        });
      case EngagementType.IMAGE:
        return props.onChange?.({
          type: EngagementType.IMAGE,
          payload: updated as ImagePayload,
        });
      case EngagementType.MESSAGE:
        return props.onChange?.({
          type: EngagementType.MESSAGE,
          payload: updated as MessagePayload,
        });
      default:
        break;
    }
  };

  return (
    <>
      <AccordionItem
        value={
          isEdit
            ? `active-${props.index}`
            : isCreate
            ? `create-${props.index}`
            : `view-${props.index}`
        }
        className="w-full"
      >
        <AccordionTrigger className="flex w-full">
          {isCreate ? (
            <div className="w-full flex justify-start">
              Crea nuovo modello ({getTemplateName(type)})
            </div>
          ) : (
            <div className="w-full flex justify-start">
              #{props.index + 1} - {template.label ?? "Nessuna etichetta"} ({getTemplateName(type)})
            </div>
          )}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4">
          {!disabled && isCreate && (
            <TemplateTypeSelector
              selectedType={type}
              disabled={props.disabled}
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
              disabled={props.disabled}
              defaultValue={template.label ?? ""}
              onChange={(e) => {
                if (isView) return;
                props.onChange({ label: e.target.value });
              }}
            />
          </div>

          <TemplateWrapper
            textAbove={textAbove}
            textBelow={textBelow}
            onTextAboveChange={(textAbove) => handlePayloadChange({ textAbove })}
            onTextBelowChange={(textBelow) => handlePayloadChange({ textBelow })}
            disabled={disabled}
            onSubmit={async () => {
              if (disabled) return;
              if (isEdit) {
                await props.onSave?.(template as ParsedEngagementTemplate);
              } else if (isCreate) {
                await props.onCreate?.(template as TemplatePayloadDraft);
              }
            }}
            templateComponent={
              type === EngagementType.QR_CODE ? (
                <QRCode
                  value={(currentPayload as QrPayload).url}
                  onChange={(url) => !disabled && handlePayloadChange({ url })}
                  disabled={disabled}
                />
              ) : type === EngagementType.IMAGE ? (
                <Image
                  value={(currentPayload as ImagePayload).imageUrl}
                  onChange={(selectedImage) =>
                    !disabled && !isView && props.onChange?.({ selectedImage })
                  }
                  disabled={disabled}
                />
              ) : (
                <Message
                  value={(currentPayload as MessagePayload).message}
                  onChange={(message) => !disabled && handlePayloadChange({ message })}
                  disabled={disabled}
                />
              )
            }
          />
        </AccordionContent>
      </AccordionItem>

      {(isEdit || isView) && (
        <Button className="mr-2" onClick={() => props.onDelete(props.template.id)}>
          <Trash size={24} />
        </Button>
      )}
    </>
  );
}
