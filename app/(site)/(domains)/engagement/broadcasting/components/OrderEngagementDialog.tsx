import { EngagementWithDetails } from "@/app/(site)/lib/shared";
import { OrderEngagementTabs } from "./EngagementTabs";
import { OrderByType } from "@/app/(site)/lib/shared";
import WasabiDialog, { WasabiDialogProps } from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import useHandleEngagement from "@/app/(site)/hooks/engagement/useHandleEngagement";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { Dispatch, SetStateAction } from "react";

type OrderEngagementDialogProps = {
  trigger: WasabiDialogProps["trigger"];
  order: OrderByType;
  onSuccess: (engagements: EngagementWithDetails[]) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function OrderEngagementDialog({
  trigger,
  order,
  onSuccess,
  open,
  setOpen,
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
    <WasabiDialog
      title="Marketing per ordine"
      trigger={trigger}
      size="mediumPlus"
      putSeparator
      putUpperBorder
      open={open}
      onOpenChange={setOpen}
    >
      <OrderEngagementTabs
        order={order}
        onToggleEngagement={async (engagementId) => {
          await handleToggleEngagement(engagementId);
        }}
        selectedTemplates={selectedTemplates}
        onSelectTemplate={onSelectTemplate}
        onCreateEngagement={handleCreateEngagement}
        onDeleteEngagement={async (engagementId) => {
          deleteEngagement(engagementId);
        }}
      />
    </WasabiDialog>
  );
}
