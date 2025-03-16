import { Button } from "@/components/ui/button";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { MarketingTemplate } from "@/prisma/generated/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TemplateFilterProps {
  marketingTemplates: MarketingTemplate[];
  activeTemplates: MarketingTemplate[];
  toggleTemplate: (template: MarketingTemplate) => void;
}

export default function TemplateFilter({
  marketingTemplates,
  activeTemplates,
  toggleTemplate,
}: TemplateFilterProps) {
  return (
    <DialogWrapper
      putSeparator
      title="Seleziona filtri marketing"
      trigger={<Button className="w-full">Filtri marketing</Button>}
    >
      <div className="grid grid-cols-3 gap-3">
        {marketingTemplates
          .slice()
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((template) => (
            <div key={template.label} className="flex items-center gap-2">
              <Checkbox
                id={template.label}
                checked={activeTemplates.some((t) => t.label === template.label)}
                onCheckedChange={() => toggleTemplate(template)}
              />
              <Label className="whitespace-nowrap" htmlFor={template.label}>
                {template.label}
              </Label>
            </div>
          ))}
      </div>
    </DialogWrapper>
  );
}
