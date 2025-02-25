import { Label } from "@/components/ui/label";
import SelectWrapper from "../components/select/SelectWrapper";
import { MarketingTemplate } from "@/prisma/generated/zod";
import React from "react";

interface TemplateSelectionProps {
  selectedTemplate: MarketingTemplate | undefined;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<MarketingTemplate | undefined>>;
  marketingTemplates: MarketingTemplate[];
}

export default function TemplateSelection({
  selectedTemplate,
  setSelectedTemplate,
  marketingTemplates,
}: TemplateSelectionProps) {
  return (
    <>
      <Label htmlFor="marketing-template-select">Azione:</Label>

      <SelectWrapper
        id="marketing-template-select"
        itemClassName="text-sm"
        className="h-10"
        value={selectedTemplate?.label || ""}
        onValueChange={(newTemplate) =>
          setSelectedTemplate(
            marketingTemplates.find((template) => template.label === newTemplate) ||
              selectedTemplate
          )
        }
        groups={[
          {
            items: marketingTemplates.map((template) => ({
              name: template.label,
              value: template.label,
            })),
          },
        ]}
      />
    </>
  );
}
