import { SidebarMenuButton } from "@/components/ui/sidebar";
import DialogWrapper from "../dialog/DialogWrapper";
import { Building, Gear } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface SettingsDialogProps {
  type: "application" | "restaurant";
  children: ReactNode;
}

export default function SettingsDialog({ type, children }: SettingsDialogProps) {
  const MenuIcon = type == "application" ? Gear : Building;

  return (
    <DialogWrapper
      title={type == "application" ? "Impostazioni applicazione" : "Impostazioni ristorante"}
      desc="Tutti i dati vengono salvati automaticamente"
      autoFocus={false}
      trigger={
        <SidebarMenuButton>
          <MenuIcon className="h-4 w-4" />{" "}
          {type == "application" ? "Impostazioni applicazione" : "Impostazioni ristorante"}
        </SidebarMenuButton>
      }
      contentClassName="flex flex-col gap-6"
    >
      {children}
    </DialogWrapper>
  );
}
