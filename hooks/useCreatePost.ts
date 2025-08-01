import { useState, useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { uploadImage } from "@/utils/uploadImages";
import Toast from "react-native-toast-message";

export const useCreatePost = () => {
  // State
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Convex mutations
  const createPost = useMutation(api.feed.createPost);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  // Refs
  const imagePickerRef = useRef<BottomSheetModal>(null);

  // Computed values
  const characterCount = content.length;
  const canPost = content.trim().length > 0;
  const hasChanges = content.trim().length > 0 || image !== null;

  // Navigation handlers
  const handleBack = useCallback(() => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  }, [hasChanges]);

  const confirmDiscard = useCallback(() => {
    setShowDiscardModal(false);
    router.back();
  }, []);

  // Image handling
  const handleAddImage = useCallback(() => {
    imagePickerRef.current?.present();
  }, []);

  const handleImageSelected = useCallback((imageUri: string) => {
    setImage(imageUri);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
  }, []);

  // Modal handlers
  const closeDiscardModal = useCallback(() => {
    setShowDiscardModal(false);
  }, []);

  const closePostModal = useCallback(() => {
    setShowPostModal(false);
  }, []);

  // Post creation handlers
  const handlePost = useCallback(() => {
    if (!canPost) return;
    setShowPostModal(true);
  }, [canPost]);

  const confirmPost = useCallback(async () => {
    if (!canPost) return;

    try {
      setIsCreating(true);
      setShowPostModal(false);

      // Show loading modal for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let imageId: string | undefined;

      // Upload image if present
      if (image) {
        const uploadResult = await uploadImage(image, generateUploadUrl);
        if (!uploadResult) {
          throw new Error("Failed to upload image");
        }
        imageId = uploadResult.storageId;
      }

      // Create the post
      await createPost({
        content: content.trim(),
        image: imageId as any,
      });

      Toast.show({
        type: "success",
        text1: "Post Created!",
        text2: "Your post has been shared successfully.",
        position: "top",
      });

      // Navigate back to feed
      router.back();
    } catch (error) {
      console.error("Post creation failed:", error);
      Toast.show({
        type: "error",
        text1: "Post Creation Failed",
        text2: error instanceof Error ? error.message : "Please try again.",
        position: "top",
      });
    } finally {
      setIsCreating(false);
    }
  }, [canPost, content, image, createPost, generateUploadUrl]);

  // Utility functions
  const getCounterColor = useCallback(
    (theme: any) => {
      if (characterCount >= 10) {
        return theme.colors.success;
      }
      return theme.colors.textMuted;
    },
    [characterCount]
  );

  return {
    // State
    content,
    image,
    showDiscardModal,
    showPostModal,
    isCreating,

    // Refs
    imagePickerRef,

    // Computed values
    characterCount,
    canPost,
    hasChanges,

    // Content handlers
    setContent,

    // Navigation handlers
    handleBack,

    // Post creation handlers
    handlePost,
    confirmPost,
    confirmDiscard,

    // Image handlers
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,

    // Modal handlers
    closeDiscardModal,
    closePostModal,

    // Utility functions
    getCounterColor,
  };
};
