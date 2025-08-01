import { useState, useCallback, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";

export const useUserPosts = (skip: boolean = false) => {
  const { id } = useLocalSearchParams();

  // Convert string ID to Convex ID
  const targetUserId = id as Id<"users">;

  // Convex hooks
  const {
    results: posts,
    status,
    loadMore,
    isLoading: loadingMore,
  } = usePaginatedQuery(
    api.feed.getUserPosts,
    skip ? "skip" : { targetUserId },
    { initialNumItems: 10 }
  );

  const likePostMutation = useMutation(api.feed.likePost);
  const unlikePostMutation = useMutation(api.feed.unlikePost);

  // State
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Refs
  const commentsSheetRef = useRef<BottomSheetModal>(null);
  const likesSheetRef = useRef<BottomSheetModal>(null);

  // Loading states
  const loading = status === "LoadingFirstPage";
  const userName = posts?.[0]?.user.name || "";

  // Post interaction handlers
  const handleLike = useCallback(
    async (postId: Id<"posts">) => {
      const post = posts?.find((p) => p._id === postId);
      if (!post) return;

      try {
        if (post.isLiked) {
          await unlikePostMutation({ postId });
        } else {
          await likePostMutation({ postId });
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
        Toast.show({
          type: "error",
          text1: "Failed to update like",
          text2: "Please try again.",
          position: "top",
        });
      }
    },
    [posts, likePostMutation, unlikePostMutation]
  );

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

  // Image viewer handlers
  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
  }, []);

  return {
    // State
    loading,
    posts: posts || [],
    userName,
    showImageViewer,
    selectedImages,
    selectedImageIndex,
    loadingMore,

    // Refs
    commentsSheetRef,
    likesSheetRef,

    // Post interaction handlers
    handleLike,
    handleComment,
    handleLikesPress,
    handleImagePress,
    handleReadMore,

    // Pagination
    loadMore,

    // Image viewer handlers
    closeImageViewer,
  };
};
