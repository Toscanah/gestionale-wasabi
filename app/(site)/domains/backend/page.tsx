"use client";

import { Button } from "@/components/ui/button";
import { Hash, List, Tag, UsersFour } from "@phosphor-icons/react";
import Link from "next/link";
import GoBack from "../../components/ui/misc/GoBack";

export default function Backend() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-full flex flex-col gap-16 items-center">
        <h1 className="text-8xl">Cosa vuoi gestire?</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Link href="/backend/products">
              <Button className="w-60 h-24 text-3xl gap-3" variant={"outline"}>
                <List className="mr-2 h-8 w-8" /> Prodotti
              </Button>
            </Link>

            <Link href={"../backend/customers"}>
              <Button className="w-60 h-24 text-3xl gap-3" variant={"outline"}>
                <UsersFour className="mr-2 h-8 w-8" /> Clienti
              </Button>
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="/backend/categories">
              <Button className="w-60 h-24 text-3xl gap-3" variant={"outline"}>
                <Tag className="mr-2 h-8 w-8" /> Categorie
              </Button>
            </Link>

            <Link href={"../backend/options"}>
              <Button className="w-60 h-24 text-3xl gap-3" variant={"outline"}>
                <Hash className="mr-2 h-8 w-8" /> Opzioni
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GoBack path="/home" />
    </div>
  );
}
