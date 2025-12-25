import { KeyIcon } from "@phosphor-icons/react";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import { UserCircleGear } from "@phosphor-icons/react/dist/ssr";

export default function AdminSection() {
  const adminItems: SidebarMenuGroupItem[] = [
    { type: "link", label: "Clienti", path: "/backend/customers" },
    { type: "link", label: "Prodotti", path: "/backend/products" },
    { type: "link", label: "Categorie", path: "/backend/categories" },
    { type: "link", label: "Opzioni", path: "/backend/options" },
  ];

  return (
    <SidebarMenuGroup
      label="Admin"
      icon={<KeyIcon className="w-4 h-4" />}
      items={adminItems}
    />
  );
}
