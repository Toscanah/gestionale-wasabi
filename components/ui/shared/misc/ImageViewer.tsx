import { useState } from "react";
import ReactImageViewer from "react-simple-image-viewer";
import { Button } from "@/components/ui/button";

interface ImagePreviewerProps {
  src: string;
}

export default function ImageViewer({ src }: ImagePreviewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        Mostra
      </Button>

      {isOpen && (
        <ReactImageViewer
          src={[src]}
          currentIndex={0}
          onClose={() => setIsOpen(false)}
          disableScroll
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          closeOnClickOutside
        />
      )}
    </>
  );
}
