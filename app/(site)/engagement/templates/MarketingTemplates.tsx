import { Accordion } from "@/components/ui/accordion";
import useEngagementTemplates from "../../hooks/engagement/templates/useEngagementTemplates";
import TemplateContent from "./components/TemplateContent";
import { Checkbox } from "@/components/ui/checkbox";
import { ParsedEngagementTemplate } from "../../shared";

interface MarketingTemplatesProps {
  selection?: boolean;
  onSelectTemplate?: (templateId: number, selected: boolean) => void;
  selectedTemplateIds?: number[];
  onTemplateChange?: (template: ParsedEngagementTemplate) => void;
  onTemplateDelete?: (templateId: number) => void;
}

export default function MarketingTemplates({
  selection = false,
  onSelectTemplate,
  selectedTemplateIds = [],
  onTemplateChange,
  onTemplateDelete,
}: MarketingTemplatesProps) {
  const {
    templates,
    setTemplates,
    draftTemplate,
    setDraftTemplate,
    updateTemplate,
    createTemplate,
    deleteTemplate,
  } = useEngagementTemplates();

  const handleCheckboxChange = (templateId: number) => {
    const isSelected = selectedTemplateIds.includes(templateId);
    onSelectTemplate?.(templateId, !isSelected);
  };

  const handleTemplateDelete = (templateId: number) => {
    deleteTemplate(templateId).then(() =>
      setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    );
  };

  return (
    <Accordion type="multiple" className="w-full">
      <TemplateContent
        mode="create"
        index={templates.length + 1}
        draftTemplate={draftTemplate}
        onChange={(updatedDraft) =>
          setDraftTemplate((prev) => ({
            ...prev,
            ...updatedDraft,
            payload: {
              ...prev.payload,
              ...(updatedDraft.payload ?? {}),
            },
          }))
        }
        onCreate={(newTemplate) => createTemplate(newTemplate)}
      />

      {templates.map((template, index) => {
        const isSelected = selectedTemplateIds.includes(template.id);

        return (
          <div key={template.id} className="flex gap-4 w-full items-center">
            {selection && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleCheckboxChange(template.id)}
              />
            )}
            <TemplateContent
              index={index}
              mode="edit"
              template={template}
              onChange={(updates) => {
                setTemplates((prev) =>
                  prev.map((t) => {
                    if (t.id !== template.id) return t;

                    return {
                      ...t,
                      ...updates,
                      payload: {
                        ...t.payload,
                        ...(updates.payload ?? {}),
                      },
                    };
                  })
                );
              }}
              onSave={async (updatedTemplate) => {
                onTemplateChange?.(updatedTemplate);
                updateTemplate(updatedTemplate);
              }}
              onDelete={async (templateId) => {
                await handleTemplateDelete(templateId);
                onTemplateDelete?.(templateId);
              }}
            />
          </div>
        );
      })}
    </Accordion>
  );
}
