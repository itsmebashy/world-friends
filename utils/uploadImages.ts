import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import * as ImageManipulator from "expo-image-manipulator";

export type UploadResult = {
  storageId: string;
} | null;

export async function uploadImage(
  imageUri: string,
  generateUploadUrl: ReturnType<
    typeof useMutation<typeof api.storage.generateUploadUrl>
  >
): Promise<UploadResult> {
  try {
    // Compress the image first
    const compressedImage = await compressImage(imageUri);
    if (!compressedImage) {
      throw new Error("Failed to compress image");
    }

    // Get upload URL
    const uploadUrl = await generateUploadUrl();
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL");
    }

    // For React Native, we need to upload the file as a blob
    const response = await fetch(compressedImage.uri);
    const blob = await response.blob();

    // Upload the file directly as blob with proper content type
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: blob,
    });

    if (!result.ok) {
      throw new Error("Failed to upload image");
    }

    const { storageId } = await result.json();
    return { storageId };
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

// Image compression utility for React Native
export async function compressImage(
  imageUri: string,
  maxWidth = 1200
): Promise<ImageManipulator.ImageResult | null> {
  try {
    // First, resize the image if it's too large
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: maxWidth,
          },
        },
      ],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Check if the image is still too large (> 1MB)
    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();

    if (blob.size > 1024 * 1024) {
      // If still too large, compress more aggressively
      return await ImageManipulator.manipulateAsync(
        resizedImage.uri,
        [
          {
            resize: {
              width: Math.floor(maxWidth * 0.7), // Reduce size more
            },
          },
        ],
        {
          compress: 0.6, // More aggressive compression
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
    }

    return resizedImage;
  } catch (error) {
    console.error("Image compression failed:", error);
    return null;
  }
}

// Helper to validate image URI (for React Native)
export async function validateImageUri(
  imageUri: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      return "File must be an image";
    }

    // We'll compress it anyway, so no need to check size here
    return null;
  } catch (error) {
    return "Invalid image file";
  }
}
