import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageViewer from "@/components/shared/misc/ImageViewer";

interface ImageProps {
  onChange: (file: File | null) => void;
  value: string;
  disabled?: boolean;
}

export default function Image({ onChange, value, disabled }: ImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="imageUpload">Carica immagine</Label>
      <div className="flex gap-2">
        <Input
          disabled={disabled}
          id="imageUpload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="w-full"
          placeholder="Scegli immagine"
          onChange={handleFileChange}
        />

        {previewUrl && <ImageViewer src={previewUrl} />}
      </div>
    </div>
  );
}
