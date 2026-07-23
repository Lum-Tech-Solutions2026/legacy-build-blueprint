import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;

/**
 * Returns a public URL for an uploaded media file.
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";

  // Legacy records already containing a full URL
  if (path.startsWith("http")) {
    return path;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Resize and compress images before upload.
 * Videos are uploaded unchanged.
 */
async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );

  if (scale === 1 && file.size < 500000) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, "") + ".jpg",
    {
      type: "image/jpeg",
    }
  );
}

/**
 * Upload media into the public media bucket.
 */
export async function uploadMedia(file: File): Promise<string> {
  const optimized = await optimizeImage(file);

  const extension = optimized.name.split(".").pop();

  const filename = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, optimized, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return filename;
}

/**
 * Delete uploaded media.
 */
export async function deleteMedia(path: string | null | undefined): Promise<void> {
  if (!path) return;

  if (path.startsWith("http")) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

export const BUCKET_NAME = BUCKET;
