import { useState, useEffect } from "react";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const parseAddress = (input: string) => {
  const regex = /^(.+?)\s(\d+\S*)(?:\s(\d+))?$/;
  const match = input.match(regex);

  if (match) {
    return {
      street: match[1],
      civic: match[2],
      cap: match[3] || "",
    };
  } else {
    return {
      street: input,
      civic: "",
      cap: "",
    };
  }
};

export default function RestaurantSettings() {
  const { settings, updateSettings } = useWasabiContext();
  useFocusOnClick(["address", "name", "slogan", "tel", "cell"]);

  const [logoPath, setLogoPath] = useState<string | null>("/receipt-logo.png");

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
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            type="text"
            id="address"
            defaultValue={`${settings.address.street} ${settings.address.civic} ${settings.address.cap}`}
            onChange={(e) => {
              const parsedAddress = parseAddress(e.target.value);
              updateSettings("address", { ...settings.address, ...parsedAddress });
            }}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="name">Nome</Label>
          <Input
            type="text"
            id="name"
            value={settings.name}
            onChange={(name) => updateSettings("name", name.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            type="text"
            id="slogan"
            value={settings.slogan}
            onChange={(slogan) => updateSettings("slogan", slogan.target.value)}
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
            onChange={(telNumber) => updateSettings("telNumber", telNumber.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="cell">Cellulare</Label>
          <Input
            type="text"
            id="cellNumber"
            value={settings.cellNumber}
            onChange={(cellNumber) => updateSettings("cellNumber", cellNumber.target.value)}
          />
        </div>
      </div>

      {/* Logo Upload Section */}
      <div className="flex gap-6">
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
      </div>
    </>
  );
}
