import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/stores/theme.store";
import { TabHeader } from "@/components/TabHeader";
import { Greetings } from "@/components/feed/Greetings";
import { PostCard } from "@/components/feed/PostCard";
import { PostCardSkeleton } from "@/components/feed/PostCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { LikesSheet } from "@/components/feed/LikesSheet";
import { ActionSheet } from "@/components/common/ActionSheet";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ImageViewer } from "@/components/common/ImageViewer";
import { type PostData } from "@/types/feed";
import { useFeed } from "@/hooks/useFeed";

export default function HomeScreen() {
  const theme = useTheme();

  const {
    // State
    posts,
    loading,
    loadingMore,
    selectedPostId,
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
    handleReadMore,
    handleCreatePost,

    // Delete handlers
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
  } = useFeed();

  const renderPost = useCallback(
    ({ item }: { item: PostData }) => (
      <PostCard
        post={item}
        onLike={handleLike}
        onComment={handleComment}
        onImagePress={handleImagePress}
        onMorePress={handleMorePress}
        onReadMore={handleReadMore}
        onLikesPress={handleLikesPress}
      />
    ),
    [
      handleLike,
      handleComment,
      handleImagePress,
      handleMorePress,
      handleReadMore,
      handleLikesPress,
    ]
  );

  const renderSkeleton = useCallback(() => <PostCardSkeleton />, []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [loadingMore, theme.colors.primary]);

  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        title="No posts yet"
        subtitle="Be the first to share something amazing with the community!"
        type="tab"
      />
    ),
    []
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        listContainer: {
          flex: 1,
        },
        contentContainer: {
          paddingTop: verticalScale(100), // Account for fixed header
          paddingBottom: verticalScale(100), // Account for custom tab bar
        },
        footerLoader: {
          paddingVertical: verticalScale(20),
          alignItems: "center",
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader
        title="Home"
        onNotificationPress={handleNotificationPress}
        hasNotification={true}
      />

      <View style={styles.listContainer}>
        <FlashList
          data={loading ? Array(10).fill(null) : posts}
          renderItem={loading ? renderSkeleton : renderPost}
          keyExtractor={(item, index) =>
            loading ? `skeleton-${index}` : item._id
          }
          estimatedItemSize={400}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            // Greetings component is always shown, not part of skeleton loading
            <Greetings onCreatePost={handleCreatePost} />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={styles.contentContainer}
        />
      </View>

      {selectedPostId && (
        <>
          <CommentsSheet ref={commentsSheetRef} postId={selectedPostId} />
          <LikesSheet ref={likesSheetRef} postId={selectedPostId} />
        </>
      )}

      <ActionSheet ref={actionSheetRef} options={actionSheetOptions} />

      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeletePost}
        onCancel={closeDeleteModal}
      />

      <ImageViewer
        images={selectedImages.map((uri) => ({ uri }))}
        imageIndex={selectedImageIndex}
        visible={showImageViewer}
        onRequestClose={closeImageViewer}
      />
    </SafeAreaView>
  );
}
