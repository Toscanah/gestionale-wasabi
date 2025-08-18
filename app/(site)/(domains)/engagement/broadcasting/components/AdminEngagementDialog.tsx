import DialogWrapper, { DialogWrapperProps } from "@/app/(site)/components/ui/dialog/DialogWrapper";
import useHandleEngagement from "@/app/(site)/hooks/engagement/useHandleEngagement";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { EngagementWithDetails } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import MarketingTemplates from "../../templates/MarketingTemplates";

type AdminEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
  customerIds: number[];
  onSuccess: (engagements: EngagementWithDetails[]) => void;
};

export default function AdminEngagementDialog({
  trigger,
  customerIds,
  onSuccess,
}: AdminEngagementDialogProps) {
  const { createEngagements, selectedTemplates, onSelectTemplate } = useHandleEngagement({
    customerIds,
  });

  const handleCreateEngagement = async () => {
    if (!selectedTemplates.length) return;
    await createEngagements()
      .then(onSuccess)
      .finally(() => toastSuccess("Marketing creato con successo"));
  };

  return (
    <DialogWrapper title="Marketing clienti" trigger={trigger}>
      <div className="space-y-4">
        <MarketingTemplates
          selection
          selectedTemplateIds={selectedTemplates}
          onSelectTemplate={onSelectTemplate}
        />
        <Button
          className="w-full"
          onClick={handleCreateEngagement}
          disabled={selectedTemplates.length === 0}
        >
          Crea marketing
        </Button>
      </div>
    </DialogWrapper>
  );
}
