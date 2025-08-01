import type React from "react";
import { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import type { PostData } from "@/types/feed";
import { Id } from "@/convex/_generated/dataModel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PostCardProps {
  post: PostData;
  onLike: (postId: Id<"posts">) => void;
  onComment: (postId: Id<"posts">) => void;
  onImagePress: (images: string[], index: number) => void;
  onMorePress?: (postId: Id<"posts">) => void;
  onReadMore: (postId: Id<"posts">) => void;
  onLikesPress: (postId: Id<"posts">) => void;
}

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onImagePress,
  onMorePress,
  onReadMore,
  onLikesPress,
}) => {
  const theme = useTheme();
  const [imageLoadError, setImageLoadError] = useState<{
    [key: string]: boolean;
  }>({});

  const handleImageError = useCallback((imageUrl: string) => {
    setImageLoadError((prev) => ({ ...prev, [imageUrl]: true }));
  }, []);

  const handleLike = useCallback(() => {
    onLike(post._id);
  }, [post._id, onLike]);

  const handleComment = useCallback(() => {
    onComment(post._id);
  }, [post._id, onComment]);

  const handleMorePress = useCallback(() => {
    onMorePress?.(post._id);
  }, [post._id, onMorePress]);

  const handleReadMore = useCallback(() => {
    onReadMore(post._id);
  }, [post._id, onReadMore]);

  const handleImagePress = useCallback(
    (index: number) => {
      if (post.image) {
        // For now, we'll handle single image. Multiple images can be added later
        onImagePress([post.image], index);
      }
    },
    [post.image, onImagePress]
  );

  const handleLikesPress = useCallback(() => {
    onLikesPress(post._id);
  }, [post._id, onLikesPress]);

  const shouldShowReadMore = post.content.length > 100;
  const displayContent = shouldShowReadMore
    ? post.content.substring(0, 100).replace(/\n/g, " ") + "..."
    : post.content.replace(/\n/g, " ");

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      width: SCREEN_WIDTH,
      marginBottom: verticalScale(1),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
    },
    profileImage: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(theme.borderRadius.full),
      marginRight: scale(12),
    },
    profileImageError: {
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    timeAgo: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
    },
    moreButton: {
      padding: scale(8),
    },
    content: {
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(12),
    },
    contentText: {
      fontSize: moderateScale(15),
      color: theme.colors.text,
      lineHeight: moderateScale(20),
    },
    readMoreText: {
      color: theme.colors.primary,
      fontWeight: "500",
    },
    imagesContainer: {
      marginBottom: verticalScale(12),
    },
    singleImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.75,
    },
    multiImageContainer: {
      position: "relative",
    },
    multiImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.6,
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
    },
    overlayText: {
      color: "#FFFFFF",
      fontSize: moderateScale(20),
      fontWeight: "700",
    },
    imageError: {
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(16),
      paddingTop: verticalScale(8),
    },
    likesSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    likeButton: {
      marginRight: scale(8),
    },
    likesText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    commentButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    commentsText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      marginRight: scale(6),
      fontWeight: "500",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: scale(20),
    },
    actionText: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      marginLeft: scale(6),
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={post.user.profilePicture || undefined}
          style={[
            styles.profileImage,
            post.user.profilePicture &&
              imageLoadError[post.user.profilePicture] &&
              styles.profileImageError,
          ]}
          onError={() =>
            post.user.profilePicture &&
            handleImageError(post.user.profilePicture)
          }
          contentFit="cover"
          transition={200}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timeAgo}>
            {formatTimeAgo(post._creationTime)}
          </Text>
        </View>
        {post.isOwner && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleMorePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={scale(20)}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          {displayContent}
          {shouldShowReadMore && (
            <Text style={styles.readMoreText} onPress={handleReadMore}>
              {" read more"}
            </Text>
          )}
        </Text>
      </View>

      {/* Images */}
      {post.image && (
        <View style={styles.imagesContainer}>
          <TouchableOpacity
            onPress={() => handleImagePress(0)}
            activeOpacity={0.9}
          >
            <Image
              source={post.image}
              style={[
                styles.singleImage,
                post.image && imageLoadError[post.image] && styles.imageError,
              ]}
              onError={() => post.image && handleImageError(post.image)}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {/* Likes Section - Left */}
        <View style={styles.likesSection}>
          <TouchableOpacity
            style={styles.likeButton}
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
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLikesPress} activeOpacity={0.7}>
            <Text style={styles.likesText}>
              {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section - Right */}
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <Text style={styles.commentsText}>{post.commentsCount}</Text>
          <MaterialCommunityIcons
            name="message-reply-text-outline"
            size={scale(22)}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const PostCard = memo(PostCardComponent);
