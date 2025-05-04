import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EngagementTemplate, EngagementType } from "@prisma/client";
import TemplateChoice from "./TemplateChoice";
import { useState } from "react";

interface CreateTemplateProps {
  onCreate: (newTemplate: EngagementTemplate) => void;
}

export default function CreateTemplate() {
  return <></>;
  return (
    <AccordionItem value="new">
      <AccordionTrigger>Crea nuovo modello</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2">
        <TemplateChoice choice={choice} setChoice={setChoice} />

        <EngagementWrapper
          onTextAboveChange={(newText) => setPayload((prev) => ({ ...prev, textAbove: newText }))}
          onTextBelowChange={(newText) => setPayload((prev) => ({ ...prev, textBelow: newText }))}
          onCreateEngagement={onCreateEngagement}
          textAbove={payload.textAbove ?? ""}
          textBelow={payload.textBelow ?? ""}
        >
          {choice === EngagementType.QR_CODE ? (
            <QRCode onChange={(value) => setPayload((prev) => ({ ...prev, url: value }))} />
          ) : choice === EngagementType.IMAGE ? (
            <Image onChange={(file) => setPayload((prev) => ({ ...prev, imageFile: file }))} />
          ) : (
            <Message onChange={(value) => setPayload((prev) => ({ ...prev, message: value }))} />
          )}
        </EngagementWrapper>
      </AccordionContent>
    </AccordionItem>
  );
}
