import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import useEngagementTemplates from "../../hooks/engagement/templates/useEngagementTemplates";
import { Accordion } from "@/components/ui/accordion";
import TemplateContent from "./components/TemplateContent";

export default function MarketingTemplates() {
  const {
    templates,
    setTemplates,
    draftTemplate,
    setDraftTemplate,
    updateTemplate,
    createTemplate,
  } = useEngagementTemplates();

  return (
    <DialogWrapper
      title="Modelli marketing"
      size="medium"
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
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

        {templates.map((template, index) => (
          <TemplateContent
            key={template.id}
            index={index}
            mode="edit"
            template={template}
            onChange={(updates) =>
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
              )
            }
            onSave={(updatedTemplate) => updateTemplate(updatedTemplate)}
          />
        ))}
      </Accordion>
    </DialogWrapper>
  );
}
