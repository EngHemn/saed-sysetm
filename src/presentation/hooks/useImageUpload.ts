import { useState, useCallback } from "react";
import { ImageCompressor, CompressionResult, ImageCompressorOptions } from "@/lib/imageCompressor";

export interface UseImageUploadOptions {
  compressionOptions?: ImageCompressorOptions;
  onSuccess?: (url: string) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseImageUploadReturn {
  isCompressing: boolean;
  isUploading: boolean;
  isLoading: boolean;
  error: string | null;
  compressedResult: CompressionResult | null;
  uploadImage: (file: File) => Promise<string | null>;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccessCallback?: (url: string) => void
  ) => Promise<string | null>;
  clearError: () => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressedResult, setCompressedResult] = useState<CompressionResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      setError(null);
      setCompressedResult(null);

      // Validation: file must be an image
      if (!file.type.startsWith("image/")) {
        const msg = "Selected file is not a valid image";
        setError(msg);
        options.onError?.(msg);
        return null;
      }

      let compressed: CompressionResult;
      try {
        setIsCompressing(true);
        compressed = await ImageCompressor.compress(file, {
          minSizeKB: 400,
          maxSizeKB: 500,
          ...options.compressionOptions,
        });
        setCompressedResult(compressed);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to compress image";
        setError(msg);
        options.onError?.(msg);
        setIsCompressing(false);
        return null;
      } finally {
        setIsCompressing(false);
      }

      // Upload ONLY the compressed file to Cloudinary
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", compressed.file);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload compressed image to server");
        }

        const data = await response.json();
        if (data.success && data.result?.secure_url) {
          const url = data.result.secure_url as string;
          options.onSuccess?.(url);
          return url;
        } else {
          throw new Error(data.error || "Image upload failed");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An error occurred during image upload";
        setError(msg);
        options.onError?.(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onSuccessCallback?: (url: string) => void
    ): Promise<string | null> => {
      const file = e.target.files?.[0];
      if (!file) return null;

      const url = await uploadImage(file);
      if (url && onSuccessCallback) {
        onSuccessCallback(url);
      }

      // Reset file input value so re-selecting the same file fires change event
      e.target.value = "";
      return url;
    },
    [uploadImage]
  );

  return {
    isCompressing,
    isUploading,
    isLoading: isCompressing || isUploading,
    error,
    compressedResult,
    uploadImage,
    handleFileChange,
    clearError,
  };
}
