export type UploadImageType = "receipt" | "engagements";

export default async function uploadImage(
  file: File | null,
  type: UploadImageType
): Promise<{ success: boolean; path: string }> {
  if (!file) {
    throw new Error("File is required");
  }

  const formData = new FormData();
  formData.append("content", file);
  formData.append("type", type);

  const res = await fetch("/api/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Upload failed");
  }

  return await res.json();
}
