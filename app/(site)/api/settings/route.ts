import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("content") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Get file extension and enforce only PNG, JPG, JPEG
    const validExtensions = ["png", "jpg", "jpeg"];
    const fileExtension = path.extname(file.name).replace(".", "").toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPG, and JPEG are allowed." },
        { status: 400 }
      );
    }

    // ✅ Define the directory and new file path
    const publicFolder = path.join(process.cwd(), "public");
    const newFilePath = path.join(publicFolder, `receipt-logo.${fileExtension}`);

    // ✅ Delete any existing `receipt-logo.*` files before saving the new one
    fs.readdirSync(publicFolder)
      .filter(
        (file) => file.startsWith("receipt-logo.") && file !== `receipt-logo.${fileExtension}`
      )
      .forEach((file) => fs.unlinkSync(path.join(publicFolder, file)));

    // ✅ Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // ✅ Save the new file
    fs.writeFileSync(newFilePath, fileBuffer);

    return NextResponse.json(
      { success: true, path: `/receipt-logo.${fileExtension}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const publicFolder = path.join(process.cwd(), "public");
    const files = fs.readdirSync(publicFolder);

    // ✅ Find file that matches "receipt-logo.*"
    const logoFile = files.find((file) => file.startsWith("receipt-logo."));

    if (!logoFile) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }

    return NextResponse.json({ logoPath: `/${logoFile}` }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logo:", error);
    return NextResponse.json({ error: "Failed to retrieve logo" }, { status: 500 });
  }
}
