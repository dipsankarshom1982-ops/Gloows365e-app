/**
 * Cloudflare Stream helpers
 *
 * Uploads video through your Cloudflare Worker (/upload endpoint)
 * which proxies to CF Stream API server-side.
 *
 * This avoids all client-side TUS/format/CORS issues — the worker
 * handles authentication and multipart encoding on the server.
 *
 * Uses expo-file-system uploadAsync for native streaming — no OOM.
 */
import {
  cacheDirectory,
  copyAsync,
  deleteAsync,
  FileSystemSessionType,
  FileSystemUploadType,
  getInfoAsync,
  uploadAsync,
} from "expo-file-system/legacy";

const CF_CUSTOMER_CODE = "cif09s9962jkfc36";
const WORKER_URL       = process.env.EXPO_PUBLIC_CF_WORKER_URL ?? "";

export function streamPlaybackUrl(videoId: string): string {
  return `https://customer-${CF_CUSTOMER_CODE}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
}

export function streamThumbnailUrl(videoId: string, timeSecs = 1): string {
  return `https://customer-${CF_CUSTOMER_CODE}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=${timeSecs}s`;
}

// ── Step 1: Not needed anymore — worker handles full upload ───
// Kept for compatibility — returns a dummy uploadURL pointing to worker
export async function getStreamUploadUrl(title?: string): Promise<{
  uploadURL:    string;
  videoId:      string;
  playbackUrl:  string;
  thumbnailUrl: string;
}> {
  if (!WORKER_URL || WORKER_URL.includes("YOUR_WORKER"))
    throw new Error("EXPO_PUBLIC_CF_WORKER_URL not configured");

  // Return worker /upload endpoint as the uploadURL
  // videoId/playbackUrl/thumbnailUrl will be filled after actual upload
  return {
    uploadURL:    `${WORKER_URL}/upload`,
    videoId:      "",
    playbackUrl:  "",
    thumbnailUrl: "",
  };
}

// ── Upload video through worker proxy ─────────────────────────
// Sends raw video to worker /upload → worker uploads to CF Stream API.
// Returns { uid, playbackUrl, thumbnailUrl } from worker response.
export async function uploadToStream(
  uploadURL:   string,  // = WORKER_URL/upload
  localUri:    string,
  onProgress?: (pct: number) => void,
  title?:      string
): Promise<{ uid: string; playbackUrl: string; thumbnailUrl: string }> {
  console.log("[CF-2] localUri:", localUri.slice(0, 60));
  console.log("[CF-2] Uploading via worker proxy:", uploadURL);

  // Ensure stable file:// URI
  let uploadUri  = localUri;
  let cacheUri: string | null = null;
  if (localUri.startsWith("content://")) {
    cacheUri  = `${cacheDirectory}cf_${Date.now()}.mp4`;
    await copyAsync({ from: localUri, to: cacheUri });
    uploadUri = cacheUri;
    console.log("[CF-2] Copied content:// to cache");
  }

  try {
    const info = await getInfoAsync(uploadUri);
    if (!info.exists) throw new Error("Video file not found: " + uploadUri);

    console.log("[CF-2] Sending to worker...");

    // Send raw binary to worker — worker builds multipart and forwards to CF
    const result = await uploadAsync(uploadURL, uploadUri, {
      httpMethod:  "POST",
      uploadType:  FileSystemUploadType.BINARY_CONTENT,
      mimeType:    "video/mp4",
      headers: {
        "Content-Type":   "video/mp4",
        "X-Video-Title":  title ?? "Vidya Reel",
      },
      sessionType: FileSystemSessionType.BACKGROUND,
    });

    console.log("[CF-2] Worker response status:", result.status);
    console.log("[CF-2] Worker response:", result.body?.slice(0, 300));

    if (result.status < 200 || result.status >= 300) {
      throw new Error(
        `Worker upload failed — HTTP ${result.status}: ${result.body?.slice(0, 300)}`
      );
    }

    const data = JSON.parse(result.body ?? "{}");
    if (!data.uid) throw new Error(`Worker response missing uid: ${result.body?.slice(0, 200)}`);

    onProgress?.(100);
    console.log("[CF-2] ✅ Upload complete. uid:", data.uid);

    return {
      uid:          data.uid,
      playbackUrl:  data.playbackUrl  ?? streamPlaybackUrl(data.uid),
      thumbnailUrl: data.thumbnailUrl ?? streamThumbnailUrl(data.uid),
    };
  } finally {
    if (cacheUri) deleteAsync(cacheUri, { idempotent: true }).catch(() => {});
  }
}