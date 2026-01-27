import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { UploadImageType } from "@/lib/integrations/images/uploadImage";

const allowedExtensions = ["png", "jpg", "jpeg", "svg", "ico", "bmp"];
const folders = {
  receipt: path.join(process.cwd(), "public", "uploads", "logo"),
  engagements: path.join(process.cwd(), "public", "uploads", "engagements"),
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("content") as File | null;
    const type = formData.get("type") as UploadImageType;

    if (!file || !type || !(type in folders)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const ext = path.extname(file.name).replace(".", "").toLowerCase();
    const baseName = path.basename(file.name, path.extname(file.name));

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const folderPath = folders[type];
    fs.mkdirSync(folderPath, { recursive: true });

    let filename: string;

    if (type === "receipt") {
      // Always overwrite with same name
      fs.readdirSync(folderPath)
        .filter((f) => f.startsWith("receipt-logo.") && f !== `receipt-logo.${ext}`)
        .forEach((f) => fs.unlinkSync(path.join(folderPath, f)));

      filename = `receipt-logo.${ext}`;
    } else {
      // Engagement — use the uploaded filename and don't overwrite if it exists
      filename = `${baseName}.${ext}`;
      const fullPath = path.join(folderPath, filename);
      if (fs.existsSync(fullPath)) {
        return NextResponse.json({
          success: false,
          message: "File already exists. Skipped upload.",
          path: `/uploads/engagements/${filename}`,
        });
      }
    }

    const filePath = path.join(folderPath, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${type === "receipt" ? "logo" : "engagements"}/${filename}`;
    return NextResponse.json({ success: true, path: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logoDir = folders["receipt"];
    const files = fs.existsSync(logoDir) ? fs.readdirSync(logoDir) : [];
    const logo = files.find((f) => f.startsWith("receipt-logo."));

    if (!logo) {
      return NextResponse.json({ error: "Receipt logo not found" }, { status: 404 });
    }

    return NextResponse.json({ logoPath: `/uploads/logo/${logo}` }, { status: 200 });
  } catch (err) {
    console.error("Get error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
