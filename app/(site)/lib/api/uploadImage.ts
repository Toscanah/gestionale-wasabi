export type UploadImageType = "receipt" | "engagement";

export default async function uploadImage(
  file: File,
  type: UploadImageType
): Promise<{ success: boolean; path: string }> {
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
