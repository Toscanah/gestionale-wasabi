import { Input } from "@/components/ui/input";
import { useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageProps {
  onChange: (file: File | null) => void;
}

export default function Image({ onChange }: ImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
          id="imageUpload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="w-full"
          placeholder="Scegli immagine"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <Button type="button" variant={"outline"} onClick={() => setIsViewerOpen(true)}>
            Mostra
          </Button>
        )}
      </div>

      {isViewerOpen && previewUrl && (
        <ImageViewer
          src={[previewUrl]}
          currentIndex={0}
          onClose={() => setIsViewerOpen(false)}
          disableScroll={true}
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
}
