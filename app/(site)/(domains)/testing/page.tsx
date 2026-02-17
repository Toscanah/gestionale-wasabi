"use client";

import { Button } from "@/components/ui/button";
import { Cut, Raw } from "react-thermal-printer";
import print from "../printing/print";
import { useRef } from "react";
import { toPng } from "html-to-image";

export async function imageToRaw(src: string, width: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const height = Math.round((img.height / img.width) * width);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
        })!;

        // White background (thermal printers = white = no heat)
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data32 = new Uint32Array(imageData.data.buffer);

        const bytesPerRow = (width + 7) >> 3;
        const raster = new Uint8Array(bytesPerRow * height);

        let rasterPtr = 0;

        for (let y = 0; y < height; y++) {
          let rowPtr = y * width;
          let x = 0;

          // Process full 8-pixel blocks
          for (; x + 7 < width; x += 8) {
            let byte = 0;

            // GREEN channel only (fastest + good enough)
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 7;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 6;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 5;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 4;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 3;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 2;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 1;
            byte |= +(((data32[rowPtr++] >> 8) & 0xff) < 128) << 0;

            raster[rasterPtr++] = byte;
          }

          // Handle remaining pixels (if width not multiple of 8)
          if (x < width) {
            let byte = 0;
            let bit = 7;

            for (; x < width; x++) {
              if (((data32[rowPtr++] >> 8) & 0xff) < 128) {
                byte |= 1 << bit;
              }
              bit--;
            }

            raster[rasterPtr++] = byte;
          }
        }

        // ESC/POS GS v 0
        const xL = bytesPerRow & 0xff;
        const xH = bytesPerRow >> 8;
        const yL = height & 0xff;
        const yH = height >> 8;

        const result = new Uint8Array(8 + raster.length);

        // Header
        result[0] = 0x1d;
        result[1] = 0x76;
        result[2] = 0x30;
        result[3] = 0x00;
        result[4] = xL;
        result[5] = xH;
        result[6] = yL;
        result[7] = yH;

        // Image data
        result.set(raster, 8);

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
  });
}

export default function TestingPage() {
  // A ref to the hidden div we want to "photograph"
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    try {
      if (!receiptRef.current) return;

      // 1. Convert the HTML/Tailwind element to a PNG Data URL
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 1, // Keep it 1:1 for thermal printer density
        backgroundColor: "#ffffff",
      });

      // 2. Convert that PNG to the raw bytes your printer expects
      // We use the printer's max width (usually 384 or 576px)
      const receiptData = await imageToRaw(dataUrl, 384);

      await print(() => (
        <>
          <Raw data={receiptData} />
          <Cut />
        </>
      ));
    } catch (e) {
      console.error("Print failed:", e);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8">
      <div className="absolute top-0">
        <div
          ref={receiptRef}
          // Add w-[384px] to match your printer width (handlePrint uses 384)
          // This prevents the text from running off-screen and getting clipped
          className="flex-row w-[384px] bg-white p-2 flex items-center justify-center text-black text-6xl font-[900] tracking-tighter leading-none italic"
        >
          {/* <span className="text-6xl font-[900] tracking-tighter leading-none italic"> */}
            5% SCONTO
          {/* </span> */}
        </div>
      </div>

      <Button
        className="flex-col w-96 h-96 text-2xl font-bold border-4 border-black"
        variant="outline"
        onClick={handlePrint}
      >
        PRINT CUSTOM HTML
      </Button>
    </div>
  );
}
