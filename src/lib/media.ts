import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";

// Resolve a stored media path to a usable URL.
// Stored value can be a full URL (legacy) or a storage path within the bucket.
export async function getMediaUrl(path: string | null | undefined): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24);
  return data?.signedUrl ?? "";
}

export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
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
