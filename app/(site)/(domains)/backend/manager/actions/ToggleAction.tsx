import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { useCallback } from "react";
import { ActionProps } from "../Manager";
import { Button } from "@/components/ui/button";
import { BaseEntity } from "@/hooks/backend/useManager";
import { MANAGER_LABELS } from "@/lib/shared/constants/manager-labels";
import { PowerIcon } from "@phosphor-icons/react";
import { PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToggleAction<TDomain extends BaseEntity>({
  handleToggle,
  title,
}: {
  handleToggle: (object: TDomain) => void;
  title: string;
}) {
  return useCallback(
    ({ object }: ActionProps<TDomain>) => (
      <WasabiDialog
        size="small"
        title={`Disattiva ${title}`}
        trigger={
          <Button
            variant="outline"
            className={cn(object.active ? "text-destructive" : "text-green-600")}
          >
            {object.active ? <PowerOff size={20} /> : <PowerIcon size={20} />}
          </Button>
        } // object.active ? "Disattiva" : "Attiva"
        variant="delete"
        onDelete={() => handleToggle(object)}
      >
        <div>
          Stai per <b>{object.active ? "disattivare" : "attivare"}</b> questo {title}. Sei sicuro?
        </div>
      </WasabiDialog>
    ),
    [handleToggle]
  );
}
