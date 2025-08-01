import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { router } from "expo-router";
import { useMutation, usePaginatedQuery } from "convex/react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@/stores/theme.store";

import { type ActionSheetOption } from "@/components/common/ActionSheet";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const useFeed = () => {
  const theme = useTheme();

  // Convex hooks
  const updateLastActive = useMutation(api.profiles.updateLastActive);
  const deletePostMutation = useMutation(api.feed.deletePost);
  const likePostMutation = useMutation(api.feed.likePost);
  const unlikePostMutation = useMutation(api.feed.unlikePost);

  // Paginated query for feed posts
  const {
    results: posts,
    status,
    loadMore,
    isLoading: loadingMore,
  } = usePaginatedQuery(api.feed.getFeedPosts, {}, { initialNumItems: 10 });

  // Update last active when component mounts
  useEffect(() => {
    const updateUserActivity = async () => {
      try {
        await updateLastActive();
      } catch (error) {
        console.error("Failed to update last active:", error);
      }
    };

    updateUserActivity();
  }, [updateLastActive]);

  // State
  const [selectedPostId, setSelectedPostId] = useState<Id<"posts"> | null>(
    null
  );

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Id<"posts"> | null>(null);

  // Refs
  const commentsSheetRef = useRef<BottomSheetModal>(null);
  const likesSheetRef = useRef<BottomSheetModal>(null);
  const actionSheetRef = useRef<BottomSheetModal>(null);

  // Loading state
  const loading = status === "LoadingFirstPage";

  // Post interaction handlers
  const handleLike = useCallback(
    async (postId: Id<"posts">) => {
      try {
        const post = posts?.find((p) => p._id === postId);
        if (!post) return;

        if (post.isLiked) {
          await unlikePostMutation({ postId });
        } else {
          await likePostMutation({ postId });
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
      }
    },
    [posts, likePostMutation, unlikePostMutation]
  );

  const handleComment = useCallback((postId: Id<"posts">) => {
    setSelectedPostId(postId);
    commentsSheetRef.current?.present();
  }, []);

  const handleLikesPress = useCallback((postId: Id<"posts">) => {
    setSelectedPostId(postId);
    likesSheetRef.current?.present();
  }, []);

  const handleImagePress = useCallback((images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  }, []);

  const handleMorePress = useCallback((postId: Id<"posts">) => {
    setSelectedPostId(postId);
    setPostToDelete(postId);
    actionSheetRef.current?.present();
  }, []);

  const handleReadMore = useCallback((postId: Id<"posts">) => {
    router.push(`/screens/post-details/${postId}`);
  }, []);

  const handleCreatePost = useCallback(() => {
    router.push("/screens/create-post");
  }, []);

  // Delete post handlers
  const handleDeletePost = useCallback(() => {
    actionSheetRef.current?.dismiss();
    setShowDeleteModal(true);
  }, []);

  const confirmDeletePost = useCallback(async () => {
    if (postToDelete) {
      try {
        await deletePostMutation({ postId: postToDelete });
        setPostToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  }, [postToDelete, deletePostMutation]);

  // Load more posts
  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  // Navigation handlers
  const handleNotificationPress = useCallback(() => {
    router.push("/screens/user-posts/user1");
  }, []);

  // Action sheet options
  const actionSheetOptions: ActionSheetOption[] = useMemo(
    () => [
      {
        id: "delete",
        title: "Delete Post",
        icon: "trash-outline",
        color: theme.colors.error,
        onPress: handleDeletePost,
      },
    ],
    [theme.colors.error, handleDeletePost]
  );

  // Modal handlers
  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return {
    // State
    posts: posts || [],
    loading,
    loadingMore,
    selectedPostId,
    showImageViewer,
    selectedImages,
    selectedImageIndex,
    showDeleteModal,
    postToDelete,

    // Refs
    commentsSheetRef,
    likesSheetRef,
    actionSheetRef,

    // Post interaction handlers
    handleLike,
    handleComment,
    handleLikesPress,
    handleImagePress,
    handleMorePress,
    handleReadMore,
    handleCreatePost,

    // Delete handlers
    handleDeletePost,
    confirmDeletePost,

    // Load more
    handleLoadMore,

    // Navigation
    handleNotificationPress,

    // Options
    actionSheetOptions,

    // Modal handlers
    closeImageViewer,
    closeDeleteModal,
  };
};
