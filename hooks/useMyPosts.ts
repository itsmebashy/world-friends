import { useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";

export const useMyPosts = (skip: boolean = false) => {
  // Convex hooks
  const {
    results: posts,
    status,
    loadMore,
    isLoading: loadingMore,
  } = usePaginatedQuery(api.feed.getMyPosts, skip ? "skip" : {}, {
    initialNumItems: 10,
  });

  const deletePostMutation = useMutation(api.feed.deletePost);

  // State
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Id<"posts"> | null>(null);

  // Refs
  const commentsSheetRef = useRef<BottomSheetModal>(null);
  const likesSheetRef = useRef<BottomSheetModal>(null);

  // Loading states
  const loading = status === "LoadingFirstPage";

  // Post interaction handlers
  const handleComment = useCallback((postId: Id<"posts">) => {
    // Set the selected post and open comments sheet
    commentsSheetRef.current?.present();
  }, []);

  const handleLikesPress = useCallback((postId: Id<"posts">) => {
    // Set the selected post and open likes sheet
    likesSheetRef.current?.present();
  }, []);

  const handleImagePress = useCallback((images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  }, []);

  const handleReadMore = useCallback((postId: Id<"posts">) => {
    router.push(`/post/${postId}` as any);
  }, []);

  const handleMorePress = useCallback((postId: Id<"posts">) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  }, []);

  // Delete functionality
  const confirmDeletePost = useCallback(async () => {
    if (!postToDelete) return;

    try {
      await deletePostMutation({ postId: postToDelete });
      setPostToDelete(null);
      setShowDeleteModal(false);
      Toast.show({
        type: "success",
        text1: "Post deleted",
        text2: "Your post has been deleted successfully.",
        position: "top",
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete post",
        text2: "Please try again.",
        position: "top",
      });
    }
  }, [postToDelete, deletePostMutation]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  }, []);

  // Image viewer handlers
  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
  }, []);

  return {
    // State
    loading,
    posts: posts || [],
    showImageViewer,
    selectedImages,
    selectedImageIndex,
    loadingMore,
    showDeleteModal,

    // Refs
    commentsSheetRef,
    likesSheetRef,

    // Post interaction handlers
    handleComment,
    handleLikesPress,
    handleImagePress,
    handleReadMore,
    handleMorePress,

    // Delete functionality
    confirmDeletePost,
    closeDeleteModal,

    // Pagination
    loadMore,

    // Image viewer handlers
    closeImageViewer,
  };
};
