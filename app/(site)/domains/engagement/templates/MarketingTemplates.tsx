import { Accordion } from "@/components/ui/accordion";
import useEngagementTemplates from "../../../hooks/engagement/templates/useEngagementTemplates";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreateEngagementTemplate,
  ParsedEngagementTemplate,
  TemplatePayloadDraft,
} from "../../../lib/shared";
import TemplateContentCreate from "./components/content/TemplateContentCreate";
import TemplateContentEdit from "./components/content/TemplateContentEdit";
import TemplateContentView from "./components/content/TemplateContentView";

interface MarketingTemplatesProps {
  selection?: boolean;
  onSelectTemplate?: (templateId: number, selected: boolean) => void;
  selectedTemplateIds?: number[];
  filterFn?: (template: ParsedEngagementTemplate) => boolean;
}

export default function MarketingTemplates({
  selection = false,
  onSelectTemplate,
  selectedTemplateIds = [],
  filterFn,
}: MarketingTemplatesProps) {
  const {
    templates,
    setTemplates,
    draftTemplate,
    setDraftTemplate,
    updateTemplate,
    createTemplate,
    deleteTemplate,
    resetDraftTemplate,
  } = useEngagementTemplates();

  const filteredTemplates = filterFn ? templates.filter(filterFn) : templates;

  const handleCheckboxChange = (templateId: number) => {
    const isSelected = selectedTemplateIds.includes(templateId);
    onSelectTemplate?.(templateId, !isSelected);
  };

  const handleTemplateDelete = async (templateId: number) => {
    await deleteTemplate(templateId);
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  const handleTemplateSave = async (updatedTemplate: ParsedEngagementTemplate) => {
    updateTemplate(updatedTemplate);
  };

  const handleTemplateCreate = async (newTemplate: TemplatePayloadDraft) =>
    await createTemplate(newTemplate);

  const handleNewTemplateChange = (updatedDraft: Partial<CreateEngagementTemplate>) => {
    setDraftTemplate((prev) => ({
      ...prev,
      ...updatedDraft,
      payload: {
        ...prev.payload,
        ...(updatedDraft.payload ?? {}),
      },
    }));
  };

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

  const handleTypeChange = resetDraftTemplate;

  return (
    <Accordion type="multiple" className="w-full">
      {!selection && (
        <TemplateContentCreate
          index={filteredTemplates.length + 1}
          draftTemplate={draftTemplate}
          onChange={handleNewTemplateChange}
          onCreate={handleTemplateCreate}
          onTypeChange={handleTypeChange}
        />
      )}

      {filteredTemplates.length > 0 ? (
        filteredTemplates.map((template, index) => {
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

              {selection ? (
                <TemplateContentView index={index} template={template} />
              ) : (
                <TemplateContentEdit
                  index={index}
                  template={template}
                  onChange={(updates) => handleTemplateChange(template.id, updates)}
                  onDelete={handleTemplateDelete}
                  onSave={handleTemplateSave}
                />
              )}
            </div>
          );
        })
      ) : (
        <p className="mt-4 text-muted-foreground w-full flex justify-center">
          Nessun modello disponibile
        </p>
      )}
    </Accordion>
  );
}
