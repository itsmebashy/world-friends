import { useState, useRef, useCallback, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@/stores/theme.store";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { type ActionSheetOption } from "@/components/common/ActionSheet";
import { type PostData } from "@/types/feed";
import Toast from "react-native-toast-message";

export const usePostDetails = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  // Convert string ID to Convex ID
  const postId = id as Id<"posts">;

  // Convex hooks
  const post = useQuery(api.feed.getPostDetails, { postId });
  const deletePostMutation = useMutation(api.feed.deletePost);
  const likePostMutation = useMutation(api.feed.likePost);
  const unlikePostMutation = useMutation(api.feed.unlikePost);

  // State
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Refs
  const commentsSheetRef = useRef<BottomSheetModal>(null);
  const likesSheetRef = useRef<BottomSheetModal>(null);
  const actionSheetRef = useRef<BottomSheetModal>(null);

  // Loading state
  const loading = post === undefined;

  // Post interaction handlers
  const handleLike = useCallback(async () => {
    if (!post) return;

    try {
      if (post.isLiked) {
        await unlikePostMutation({ postId: post._id });
      } else {
        await likePostMutation({ postId: post._id });
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
  }, [post, likePostMutation, unlikePostMutation]);

  const handleComment = useCallback(() => {
    if (!post) return;
    commentsSheetRef.current?.present();
  }, [post]);

  const handleLikesPress = useCallback(() => {
    if (!post) return;
    likesSheetRef.current?.present();
  }, [post]);

  const handleImagePress = useCallback((images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  }, []);

  const handleMorePress = useCallback(() => {
    if (!post?.isOwner) return;
    actionSheetRef.current?.present();
  }, [post]);

  // Delete functionality
  const handleDeletePost = useCallback(() => {
    actionSheetRef.current?.dismiss();
    setShowDeleteModal(true);
  }, []);

  const confirmDeletePost = useCallback(async () => {
    if (!post) return;

    try {
      await deletePostMutation({ postId: post._id });
      setShowDeleteModal(false);
      Toast.show({
        type: "success",
        text1: "Post deleted",
        text2: "Your post has been deleted successfully.",
        position: "top",
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete post:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete post",
        text2: "Please try again.",
        position: "top",
      });
    }
  }, [post, deletePostMutation]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
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

  return {
    // State
    loading,
    post,
    selectedPostId: post?._id || null,
    showImageViewer,
    selectedImages,
    selectedImageIndex,
    showDeleteModal,

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

    // Delete functionality
    confirmDeletePost,
    closeDeleteModal,
    closeImageViewer,

    // Action sheet options
    actionSheetOptions,
  };
};
