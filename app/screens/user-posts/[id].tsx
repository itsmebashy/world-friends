import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from "react-native-size-matters";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { PostCard } from "@/components/feed/PostCard";
import { EmptyState } from "@/components/EmptyState";
import { ScreenLoading } from "@/components/ScreenLoading";
import { ImageViewer } from "@/components/common/ImageViewer";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { LikesSheet } from "@/components/feed/LikesSheet";
import { useUserPosts } from "@/hooks/useUserPosts";
import { useMyPosts } from "@/hooks/useMyPosts";
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { PostData } from "@/types/feed";

export default function UserPostsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  // Get current user profile to determine if viewing own posts
  const currentProfile = useConvexQuery(api.profiles.getCurrentProfile);
  const targetUserId = id as Id<"users">;

  // Determine if viewing own posts
  const isOwnPosts = currentProfile?.userId === targetUserId;

  // Call hooks conditionally using skip parameter
  const userPostsData = useUserPosts(isOwnPosts); // Skip if viewing own posts
  const myPostsData = useMyPosts(!isOwnPosts); // Skip if viewing other's posts

  // Select the appropriate data
  const {
    loading,
    posts,
    showImageViewer,
    selectedImages,
    selectedImageIndex,
    commentsSheetRef,
    likesSheetRef,
    handleComment,
    handleLikesPress,
    handleImagePress,
    handleReadMore,
    closeImageViewer,
  } = isOwnPosts ? myPostsData : userPostsData;

  // Get specific handlers based on post type
  const handleLike = isOwnPosts ? undefined : userPostsData.handleLike;
  const handleMorePress = isOwnPosts ? myPostsData.handleMorePress : undefined;
  const showDeleteModal = isOwnPosts ? myPostsData.showDeleteModal : false;
  const confirmDeletePost = isOwnPosts
    ? myPostsData.confirmDeletePost
    : undefined;
  const closeDeleteModal = isOwnPosts
    ? myPostsData.closeDeleteModal
    : undefined;

  // Get user name from posts or current profile
  const userName = isOwnPosts
    ? currentProfile?.name || "My"
    : posts?.[0]?.user.name || "";

  const renderPost = useCallback(
    ({ item }: { item: PostData }) => (
      <PostCard
        post={item}
        onLike={handleLike || (() => {})}
        onComment={handleComment}
        onImagePress={handleImagePress}
        onReadMore={handleReadMore}
        onLikesPress={handleLikesPress}
        onMorePress={handleMorePress}
      />
    ),
    [
      handleLike,
      handleComment,
      handleImagePress,
      handleReadMore,
      handleLikesPress,
      handleMorePress,
    ]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    listContainer: {
      flex: 1,
    },
  });

  if (loading) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={`${userName}'s Posts`} />

      <View style={styles.listContainer}>
        <FlashList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          estimatedItemSize={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(20),
          }}
          ListEmptyComponent={() => (
            <EmptyState
              title="No posts yet"
              subtitle={`${userName} hasn't shared any posts yet.`}
              type="screen"
            />
          )}
        />
      </View>

      <ImageViewer
        images={selectedImages.map((uri) => ({ uri }))}
        imageIndex={selectedImageIndex}
        visible={showImageViewer}
        onRequestClose={closeImageViewer}
      />

      {/* Comments Sheet */}
      <CommentsSheet ref={commentsSheetRef} postId={posts?.[0]?._id} />

      {/* Likes Sheet */}
      <LikesSheet ref={likesSheetRef} postId={posts?.[0]?._id} />

      {/* Delete Confirmation Modal - Only for own posts */}
      {isOwnPosts && showDeleteModal && (
        <ConfirmationModal
          visible={showDeleteModal}
          icon="trash-outline"
          title="Delete Post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDeletePost!}
          onCancel={closeDeleteModal!}
        />
      )}
    </SafeAreaView>
  );
}
