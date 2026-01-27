import { SidebarMenuButton } from "@/components/ui/sidebar";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { Gear } from "@phosphor-icons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantSettings from "./restaurant/RestaurantSettings";
import ApplicationSettings from "./application/ApplicationSettings";

export default function SettingsDialog() {
  const tabs = [
    {
      value: "application",
      label: "Applicazione",
      component: <ApplicationSettings />,
    },
    {
      value: "restaurant",
      label: "Ristorante",
      component: <RestaurantSettings />,
    },
  ];

  return (
    <WasabiDialog
      title={"Impostazioni"}
      desc="Tutti i dati vengono salvati automaticamente"
      autoFocus={false}
      trigger={
        <SidebarMenuButton>
          <Gear className="h-4 w-4" /> Impostazioni
        </SidebarMenuButton>
      }
      putUpperBorder
      contentClassName="h-[45rem] max-h-[45rem] flex flex-col gap-6"
    >
      <Tabs defaultValue="application" className="w-full h-full">
        <TabsList className="w-full mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full data-[state=active]:bg-foreground data-[state=active]:text-muted"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </WasabiDialog>
  );
}
