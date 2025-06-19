import { EngagementWithDetails } from "@/app/(site)/shared";
import { OrderEngagementTabs } from "./EngagementTabs";
import { AnyOrder } from "@/app/(site)/shared";
import DialogWrapper, { DialogWrapperProps } from "@/app/(site)/components/ui/dialog/DialogWrapper";
import useHandleEngagement from "@/app/(site)/hooks/engagement/useHandleEngagement";
import { toastSuccess } from "@/app/(site)/lib/util/toast";

type OrderEngagementDialogProps = {
  trigger: DialogWrapperProps["trigger"];
  order: AnyOrder;
  onSuccess: (engagements: EngagementWithDetails[]) => void;
};

export default function OrderEngagementDialog({
  trigger,
  order,
  onSuccess,
}: OrderEngagementDialogProps) {
  const {
    createEngagements,
    selectedTemplates,
    onSelectTemplate,
    deleteEngagement,
    toggleEngagement,
  } = useHandleEngagement({ order });

  const handleCreateEngagement = async () => {
    if (!selectedTemplates.length) return;
    await createEngagements()
      .then(onSuccess)
      .finally(() => toastSuccess("Marketing creato con successo"));
  };

  const handleToggleEngagement = toggleEngagement;

  return (
    <DialogWrapper title="Marketing per ordine" trigger={trigger}>
      <OrderEngagementTabs
        order={order}
        onToggleEngagement={handleToggleEngagement}
        selectedTemplates={selectedTemplates}
        onSelectTemplate={onSelectTemplate}
        onCreateEngagement={handleCreateEngagement}
        onDeleteEngagement={async (engagementId) => {
          deleteEngagement(engagementId);
        }}
      />
    </DialogWrapper>
  );
}
