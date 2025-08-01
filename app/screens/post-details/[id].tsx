import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { LikesSheet } from "@/components/feed/LikesSheet";
import { ActionSheet } from "@/components/common/ActionSheet";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ImageViewer } from "@/components/common/ImageViewer";
import { usePostDetails } from "@/hooks/usePostDetails";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostDetailsScreen() {
  const theme = useTheme();

  const {
    // State
    loading,
    post,
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
    handleBookmark,
    handleComment,
    handleLikesPress,
    handleImagePress,
    handleEllipsisPress,

    // Delete functionality
    confirmDeletePost,
    closeDeleteModal,
    closeImageViewer,

    // Action sheet options
    actionSheetOptions,

    // Utility functions
    formatTimeAgo,
  } = usePostDetails();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flex: 1,
    },
    postContainer: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(16),
    },
    profileImage: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(theme.borderRadius.full),
      marginRight: scale(12),
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    timeAgo: {
      fontSize: moderateScale(13),
      color: theme.colors.textMuted,
    },
    contentText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      lineHeight: moderateScale(14),
      marginBottom: verticalScale(16),
    },
    imagesContainer: {
      marginBottom: verticalScale(16),
    },
    singleImage: {
      width: SCREEN_WIDTH - scale(32),
      height: (SCREEN_WIDTH - scale(32)) * 0.75,
      borderRadius: scale(theme.borderRadius.md),
    },
    multiImageContainer: {
      position: "relative",
    },
    multiImage: {
      width: SCREEN_WIDTH - scale(32),
      height: (SCREEN_WIDTH - scale(32)) * 0.6,
      borderRadius: scale(theme.borderRadius.md),
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: scale(theme.borderRadius.md),
    },
    overlayText: {
      color: "#FFFFFF",
      fontSize: moderateScale(20),
      fontWeight: "700",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: verticalScale(8),
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: scale(24),
    },
    actionText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      marginLeft: scale(6),
      fontWeight: "500",
    },
    bookmarkButton: {
      marginLeft: "auto",
      padding: scale(4),
    },
  });

  if (loading) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title="Post"
        rightComponent={post.isOwner ? "ellipsis" : null}
        onRightPress={handleEllipsisPress}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.postContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: post.user.profilePicture }}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <Text style={styles.timeAgo}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>

          {/* Content */}
          <Text style={styles.contentText}>{post.content}</Text>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imagesContainer}>
              {post.images.length === 1 ? (
                <TouchableOpacity
                  onPress={() => handleImagePress(post.images!, 0)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: post.images[0] }}
                    style={styles.singleImage}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.multiImageContainer}
                  onPress={() => handleImagePress(post.images!, 0)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: post.images[0] }}
                    style={styles.multiImage}
                  />
                  {post.images.length > 1 && (
                    <View style={styles.imageOverlay}>
                      <Text style={styles.overlayText}>
                        +{post.images.length - 1} more
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={scale(24)}
                color={
                  post.isLiked ? theme.colors.error : theme.colors.textSecondary
                }
              />
              <TouchableOpacity onPress={handleLikesPress} activeOpacity={0.7}>
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleComment}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chatbubble-outline"
                size={scale(22)}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={handleBookmark}
              activeOpacity={0.7}
            >
              <Ionicons
                name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
                size={scale(24)}
                color={
                  post.isBookmarked
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
