import { Accordion } from "@/components/ui/accordion";
import useEngagementTemplates from "../../hooks/engagement/templates/useEngagementTemplates";
import TemplateContent from "./components/TemplateContent";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreateEngagementTemplate,
  ParsedEngagementTemplate,
  TemplatePayloadDraft,
} from "../../shared";
import TemplateContentCreate from "./components/content/TemplateContentCreate";

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

  const handleTemplateDelete = async (templateId: number) => {
    await deleteTemplate(templateId);
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    onTemplateDelete?.(templateId);
  };

  const handleTemplateSave = async (updatedTemplate: ParsedEngagementTemplate) => {
    onTemplateChange?.(updatedTemplate);
    updateTemplate(updatedTemplate);
  };

  const handleTemplateCreate = async (newTemplate: TemplatePayloadDraft) =>
    await createTemplate(newTemplate);

  const handleNewTemplateChange = (updatedDraft: Partial<CreateEngagementTemplate>) =>
    setDraftTemplate((prev) => ({
      ...prev,
      ...updatedDraft,
      payload: {
        ...prev.payload,
        ...(updatedDraft.payload ?? {}),
      },
    }));

  const handleTemplateChange = (templateId: number, updates: Partial<ParsedEngagementTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== templateId) return t;
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
  };

  return (
    <Accordion type="multiple" className="w-full">
      <TemplateContentCreate
        index={templates.length + 1}
        draftTemplate={draftTemplate}
        onChange={handleNewTemplateChange}
        onCreate={handleTemplateCreate}
      />

      {templates.map((template, index) => {
        const isSelected = selectedTemplateIds.includes(template.id);

        return (
          <div key={template.id} className="flex gap-6 w-full items-center">
            {selection && (
              <Checkbox
                className="ml-6"
                checked={isSelected}
                onCheckedChange={() => handleCheckboxChange(template.id)}
              />
            )}

            <TemplateContent
              index={index}
              mode="edit"
              template={template}
              onChange={(updates) => handleTemplateChange(template.id, updates)}
              onSave={handleTemplateSave}
              onDelete={handleTemplateDelete}
            />
          </div>
        );
      })}
    </Accordion>
  );
}
