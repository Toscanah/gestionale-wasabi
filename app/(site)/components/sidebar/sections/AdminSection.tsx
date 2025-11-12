import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import { UserCircleGear } from "@phosphor-icons/react/dist/ssr";

export default function AdminSection() {
  const adminItems: SidebarMenuGroupItem[] = [
    { type: "link", label: "Clienti", path: "/backend/customers", disabled: true },
    { type: "link", label: "Prodotti", path: "/backend/products" },
    { type: "link", label: "Categorie", path: "/backend/categories" },
    { type: "link", label: "Opzioni", path: "/backend/options" },
  ];

  return (
    <SidebarMenuGroup
      label="Admin"
      icon={<UserCircleGear className="w-4 h-4" />}
      items={adminItems}
    />
  );
}
