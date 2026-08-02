import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };

/**
 * Extracts Cloudinary public ID from a Cloudinary image URL.
 * Supports URLs with folder structures (e.g. barber-system/xyz123) and strips extensions.
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];

    // Remove optional version tag (e.g. v1722600000/)
    path = path.replace(/^v\d+\//, "");

    // Strip query parameters
    path = path.split("?")[0];

    // Strip file extension (.webp, .jpg, .png, etc.)
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }

    return path || null;
  } catch (err: unknown) {
    console.error("Error parsing Cloudinary URL public ID:", err);
    return null;
  }
}

/**
 * Deletes an image from Cloudinary using its secure URL.
 */
export async function deleteCloudinaryImageByUrl(url: string | null | undefined): Promise<boolean> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok" || result.result === "not found";
  } catch (error: unknown) {
    console.error(`Failed to delete Cloudinary image with public_id "${publicId}":`, error);
    return false;
  }
}
