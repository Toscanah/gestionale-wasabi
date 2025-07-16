import { useState, useEffect } from "react";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TimePicker from "../../../components/ui/time/TimePicker";

export default function RestaurantSettings() {
  const { settings, updateSettings } = useWasabiContext();
  const [logoPath, setLogoPath] = useState<string | null>("/receipt-logo.png");
  useFocusOnClick(["street", "civic", "cap", "city", "name", "slogan", "tel", "cell"]);

  useEffect(() => {
    fetch("/api/settings", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.logoPath) {
          setLogoPath(`${data.logoPath}?timestamp=${new Date().getTime()}`);
        } else {
          setLogoPath(null);
        }
      })
      .catch(() => setLogoPath(null));
  }, []);

  const handleLogoUpload = async () => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Images",
          accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
          },
        },
      ],
    });

    const file = await fileHandle.getFile();
    const validExtensions = ["png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      console.error("Invalid file type. Please upload a PNG, JPG, or JPEG.");
      return;
    }

    const formData = new FormData();
    formData.append("content", file);

    const response = await fetch("/api/settings", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setLogoPath(`/receipt-logo.${fileExtension}?timestamp=${new Date().getTime()}`);
      (location as any).reload(true);
    }
  };

  return (
    <>
      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            id="name"
            value={settings.name}
            onChange={(e) => updateSettings("name", e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            type="text"
            id="slogan"
            value={settings.slogan}
            onChange={(e) => updateSettings("slogan", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="street">Via</Label>
          <Input
            type="text"
            id="street"
            value={settings.address.street}
            onChange={(e) =>
              updateSettings("address", { ...settings.address, street: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="civic">Civico</Label>
          <Input
            type="text"
            id="civic"
            value={settings.address.civic}
            onChange={(e) =>
              updateSettings("address", { ...settings.address, civic: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="cap">CAP</Label>
          <Input
            type="text"
            id="cap"
            value={settings.address.cap}
            onChange={(e) =>
              updateSettings("address", { ...settings.address, cap: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="city">Città</Label>
          <Input
            type="text"
            id="city"
            value={settings.address.city}
            onChange={(e) =>
              updateSettings("address", { ...settings.address, city: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="tel">Numero di telefono</Label>
          <Input
            type="text"
            id="tel"
            value={settings.telNumber}
            onChange={(e) => updateSettings("telNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="cell">Cellulare</Label>
          <Input
            type="text"
            id="cell"
            value={settings.cellNumber}
            onChange={(e) => updateSettings("cellNumber", e.target.value)}
          />
        </div>
      </div>

      

      {/* <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="logo">
            Logo{" "}
            <Button onClick={handleLogoUpload} variant={"link"}>
              (Seleziona nuovo logo)
            </Button>
          </Label>
          <div>
            {logoPath ? (
              <Image src={logoPath} alt="Logo" width="200" height="200" className="object-cover" />
            ) : (
              <p>No logo uploaded</p>
            )}
            <br />
          </div>
        </div>
      </div> */}
    </>
  );
}
