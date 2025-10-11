import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { useCallback } from "react";
import { ActionProps } from "../Manager";
import { Button } from "@/components/ui/button";
import { BaseEntity } from "@/app/(site)/hooks/backend/useManager";
import { MANAGER_LABELS } from "@/app/(site)/lib/shared/constants/manager-labels";
import { PowerIcon } from "@phosphor-icons/react";

export default function ToggleAction<TDomain extends BaseEntity>({
  handleToggle,
}: {
  handleToggle: (object: TDomain) => void;
}) {
  return useCallback(
    ({ object }: ActionProps<TDomain>) => (
      <WasabiDialog
        size="small"
        title={MANAGER_LABELS.confirmToggleTitle}
        trigger={<Button variant="outline">{<PowerIcon size={20} />}</Button>} // object.active ? "Disattiva" : "Attiva"
        variant="delete"
        onDelete={() => handleToggle(object)}
      >
        <div>
          Stai per <b>{object.active ? "disattivare" : "attivare"}</b> questo elemento. Sei sicuro?
        </div>
      </WasabiDialog>
    ),
    [handleToggle]
  );
}
