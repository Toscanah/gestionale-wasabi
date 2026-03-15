import { useState } from "react";
import { useWasabiContext } from "@/context/WasabiContext";
import useFocusOnClick from "@/hooks/focus/useFocusOnClick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RestaurantSettings() {
  const { settings, updateSettings } = useWasabiContext();
  const [logoPath, setLogoPath] = useState<string | null>("/receipt-logo.png");
  useFocusOnClick(["street", "civic", "cap", "city", "name", "slogan", "tel", "cell"]);

  // useEffect(() => {
  //   fetch("/api/settings", { method: "GET" })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.logoPath) {
  //         setLogoPath(`${data.logoPath}?timestamp=${new Date().getTime()}`);
  //       } else {
  //         setLogoPath(null);
  //       }
  //     })
  //     .catch(() => setLogoPath(null));
  // }, []);

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
            value={settings.profile.name}
            onChange={(e) => updateSettings("profile.name", e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            type="text"
            id="slogan"
            value={settings.profile.slogan}
            onChange={(e) => updateSettings("profile.slogan", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="street">Via</Label>
          <Input
            type="text"
            id="street"
            value={settings.profile.address.street}
            onChange={(e) =>
              updateSettings("profile.address", { ...settings.profile.address, street: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="civic">Civico</Label>
          <Input
            type="text"
            id="civic"
            value={settings.profile.address.civic}
            onChange={(e) =>
              updateSettings("profile.address", { ...settings.profile.address, civic: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="cap">CAP</Label>
          <Input
            type="text"
            id="cap"
            value={settings.profile.address.cap}
            onChange={(e) =>
              updateSettings("profile.address", { ...settings.profile.address, cap: e.target.value })
            }
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="city">Città</Label>
          <Input
            type="text"
            id="city"
            value={settings.profile.address.city}
            onChange={(e) =>
              updateSettings("profile.address", { ...settings.profile.address, city: e.target.value })
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
            value={settings.profile.telNumber}
            onChange={(e) => updateSettings("profile.telNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2 w-full">
          <Label htmlFor="cell">Cellulare</Label>
          <Input
            type="text"
            id="cell"
            value={settings.profile.cellNumber}
            onChange={(e) => updateSettings("profile.cellNumber", e.target.value)}
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
