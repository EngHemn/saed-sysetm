export interface ImageCompressorOptions {
  /** Target minimum file size in KB. Defaults to 400 */
  minSizeKB?: number;
  /** Target maximum file size in KB. Defaults to 500 */
  maxSizeKB?: number;
  /** Output MIME type. Defaults to 'image/webp' */
  mimeType?: "image/webp" | "image/jpeg";
  /** Maximum width/height dimension allowed before initial scaling. Defaults to 3840 */
  maxDimension?: number;
}

export interface CompressionResult {
  file: File;
  blob: Blob;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
  quality: number;
}

interface ProcessedImageSource {
  source: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
  cleanup: () => void;
}

export class ImageCompressor {
  /**
   * Compress an image file to a target size between minSizeKB and maxSizeKB
   * while preserving aspect ratio, correcting EXIF orientation, and maintaining visual quality.
   */
  public static async compress(
    file: File,
    options: ImageCompressorOptions = {}
  ): Promise<CompressionResult> {
    const minSizeKB = options.minSizeKB ?? 400;
    const maxSizeKB = options.maxSizeKB ?? 500;
    const mimeType = options.mimeType ?? "image/webp";
    const maxDimension = options.maxDimension ?? 3840;

    const minSizeBytes = minSizeKB * 1024;
    const maxSizeBytes = maxSizeKB * 1024;
    const originalSizeKB = Math.round(file.size / 1024);

    const imageSource = await this.loadImageSource(file);

    try {
      let origWidth = imageSource.width;
      let origHeight = imageSource.height;

      // Handle initial max dimension scaling preserving aspect ratio
      if (origWidth > maxDimension || origHeight > maxDimension) {
        const scaleFactor = Math.min(maxDimension / origWidth, maxDimension / origHeight);
        origWidth = Math.round(origWidth * scaleFactor);
        origHeight = Math.round(origHeight * scaleFactor);
      }

      // If original file is already smaller than or equal to maxSizeKB, attempt a high-quality optimization
      if (file.size <= maxSizeBytes) {
        const highQualityResult = await this.renderToBlob(
          imageSource.source,
          origWidth,
          origHeight,
          mimeType,
          0.92
        );

        if (highQualityResult.blob.size <= maxSizeBytes) {
          const finalBlob = highQualityResult.blob;
          const finalSizeKB = Math.round(finalBlob.size / 1024);
          const compressedFile = this.blobToFile(finalBlob, file.name, mimeType);

          return {
            file: compressedFile,
            blob: finalBlob,
            originalSizeKB,
            compressedSizeKB: finalSizeKB,
            width: origWidth,
            height: origHeight,
            quality: 0.92,
          };
        }
      }

      // Multi-pass iterative search for target size between minSizeBytes (400 KB) and maxSizeBytes (500 KB)
      let bestResult: { blob: Blob; width: number; height: number; quality: number } | null = null;
      let currentScale = 1.0;

      // Try scaling down up to 8 passes if necessary
      for (let pass = 0; pass < 8; pass++) {
        const targetWidth = Math.max(1, Math.round(origWidth * currentScale));
        const targetHeight = Math.max(1, Math.round(origHeight * currentScale));

        let lowQuality = 0.1;
        let highQuality = 0.95;
        let bestPassResult: { blob: Blob; width: number; height: number; quality: number } | null = null;

        // Binary search on quality for current dimensions (up to 7 iterations)
        for (let step = 0; step < 7; step++) {
          const midQuality = Number(((lowQuality + highQuality) / 2).toFixed(2));
          const currentResult = await this.renderToBlob(
            imageSource.source,
            targetWidth,
            targetHeight,
            mimeType,
            midQuality
          );

          const currentSize = currentResult.blob.size;

          if (currentSize <= maxSizeBytes) {
            // Valid size candidate below or equal to max size
            bestPassResult = {
              blob: currentResult.blob,
              width: targetWidth,
              height: targetHeight,
              quality: midQuality,
            };

            if (currentSize >= minSizeBytes) {
              // Found exact target size within [minSizeBytes, maxSizeBytes]!
              bestResult = bestPassResult;
              break;
            }

            // Size is below minSizeBytes -> try higher quality to reach target range
            lowQuality = midQuality + 0.02;
          } else {
            // Size is above maxSizeBytes -> must reduce quality
            highQuality = midQuality - 0.02;
          }

          if (highQuality - lowQuality < 0.01) {
            break;
          }
        }

        if (bestPassResult) {
          if (!bestResult || (bestPassResult.blob.size >= minSizeBytes && bestPassResult.blob.size <= maxSizeBytes)) {
            bestResult = bestPassResult;
          }
          if (bestResult.blob.size >= minSizeBytes && bestResult.blob.size <= maxSizeBytes) {
            break;
          }
        }

        // Reduce scale if even low quality exceeded target max size
        currentScale *= 0.85;
      }

      // Fallback if no result was under maxSizeBytes: render at 0.5 scale and 0.5 quality
      if (!bestResult) {
        const fallbackWidth = Math.max(1, Math.round(origWidth * 0.5));
        const fallbackHeight = Math.max(1, Math.round(origHeight * 0.5));
        const fallbackResult = await this.renderToBlob(
          imageSource.source,
          fallbackWidth,
          fallbackHeight,
          mimeType,
          0.5
        );

        bestResult = {
          blob: fallbackResult.blob,
          width: fallbackWidth,
          height: fallbackHeight,
          quality: 0.5,
        };
      }

      const finalBlob = bestResult.blob;
      const compressedFile = this.blobToFile(finalBlob, file.name, mimeType);

      return {
        file: compressedFile,
        blob: finalBlob,
        originalSizeKB,
        compressedSizeKB: Math.round(finalBlob.size / 1024),
        width: bestResult.width,
        height: bestResult.height,
        quality: bestResult.quality,
      };
    } finally {
      imageSource.cleanup();
    }
  }

  private static async loadImageSource(file: File): Promise<ProcessedImageSource> {
    // Attempt createImageBitmap with EXIF orientation correction
    if (typeof window !== "undefined" && "createImageBitmap" in window) {
      try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          cleanup: () => bitmap.close(),
        };
      } catch {
        // Fallback to HTMLImageElement if createImageBitmap fails
      }
    }

    return new Promise<ProcessedImageSource>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          source: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          cleanup: () => URL.revokeObjectURL(url),
        });
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image for compression: " + String(err)));
      };

      img.src = url;
    });
  }

  private static async renderToBlob(
    source: ImageBitmap | HTMLImageElement,
    width: number,
    height: number,
    mimeType: "image/webp" | "image/jpeg",
    quality: number
  ): Promise<{ blob: Blob }> {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not acquire 2D canvas context");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, width, height);

    return new Promise<{ blob: Blob }>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob });
          } else {
            // If WebP canvas.toBlob fails, attempt fallback to image/jpeg
            if (mimeType === "image/webp") {
              canvas.toBlob(
                (fallbackBlob) => {
                  if (fallbackBlob) {
                    resolve({ blob: fallbackBlob });
                  } else {
                    reject(new Error("Failed to export canvas to Blob"));
                  }
                },
                "image/jpeg",
                quality
              );
            } else {
              reject(new Error("Failed to export canvas to Blob"));
            }
          }
        },
        mimeType,
        quality
      );
    });
  }

  private static blobToFile(blob: Blob, originalName: string, mimeType: string): File {
    const ext = mimeType === "image/webp" ? ".webp" : ".jpg";
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}${ext}`;

    return new File([blob], fileName, {
      type: blob.type || mimeType,
      lastModified: Date.now(),
    });
  }
}
