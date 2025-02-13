import { SidebarMenuButton } from "@/components/ui/sidebar";
import DialogWrapper from "../dialog/DialogWrapper";
import { Gear } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationSettings from "../sidebar/sections/settings/ApplicationSettings";
import RestaurantSettings from "../sidebar/sections/settings/RestaurantSettings";

export default function SettingsDialog() {
  return (
    <DialogWrapper
      title={"Impostazioni"}
      desc="Tutti i dati vengono salvati automaticamente"
      autoFocus={false}
      trigger={
        <SidebarMenuButton>
          <Gear className="h-4 w-4" /> Impostazioni
        </SidebarMenuButton>
      }
      contentClassName="h-[45rem] max-h-[45rem] flex flex-col gap-6"
    >
      <Tabs defaultValue="application" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger
            value="application"
            className="w-full data-[state=active]:bg-foreground data-[state=active]:text-muted"
          >
            Applicazione
          </TabsTrigger>
          <TabsTrigger
            value="restaurant"
            className="w-full data-[state=active]:bg-foreground data-[state=active]:text-muted"
          >
            Ristorante
          </TabsTrigger>
        </TabsList>

        <TabsContent value="application" className="space-y-6">
          <ApplicationSettings />
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-6">
          <RestaurantSettings />
        </TabsContent>
      </Tabs>
    </DialogWrapper>
  );
}
