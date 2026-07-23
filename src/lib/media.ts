import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const MAX_DIMENSION = 1920; // matches what the site ever displays at full size
const JPEG_QUALITY = 0.82;

// Resolve a stored media path to a usable URL.
// Stored value can be a full URL (legacy) or a storage path within the bucket.
export async function getMediaUrl(path: string | null | undefined): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24);
  return data?.signedUrl ?? "";
}

// Resize + compress an image file in the browser before upload. Videos pass
// through untouched. Skips resizing if the image is already smaller than
// MAX_DIMENSION (no point re-encoding a small file and losing quality).
async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

  // Already small enough and already a compressed format - leave it alone.
  if (scale === 1 && file.size < 500_000) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  if (!blob || blob.size >= file.size) return file; // fall back if it didn't actually help

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

export async function uploadMedia(file: File): Promise<string> {
  const optimized = await optimizeImage(file);
  const ext = optimized.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, optimized, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteMedia(path: string | null | undefined): Promise<void> {
  if (!path || path.startsWith("http")) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export const BUCKET_NAME = BUCKET;

