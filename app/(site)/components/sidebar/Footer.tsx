"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter, SidebarMenu } from "@/components/ui/sidebar";
import fetchRequest from "../../lib/api/fetchRequest";
import DialogWrapper from "../ui/dialog/DialogWrapper";

export default function Footer() {
  return <></>;
  return (
    <SidebarFooter>
      <SidebarMenu className="p-2">
        <DialogWrapper
          size="medium"
          variant="delete"
          trigger={<Button variant={"destructive"}>ELIMINA DATI</Button>}
          onDelete={() =>
            fetchRequest<any>("DELETE", "/api/orders", "deleteEverything").then(() => {
              window.location.reload();
            })
          }
        >
          Stai per eliminare pagamenti, ordini e tutti i loro contenuti della giornata odierna, sei
          sicuro? Questa azione è finale e non reversibile. La pagina si riavvierà automaticamente
          al concludersi dell'azione
        </DialogWrapper>
      </SidebarMenu>
    </SidebarFooter>
  );
}
