import React, { forwardRef, useMemo, useState, useCallback, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import {
  BottomSheetModal,
  BottomSheetFlashList,
  BottomSheetTextInput,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { useTheme } from "@/stores/theme.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type CommentData } from "@/types/feed";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useMutation } from "convex/react";
import LottieView from "lottie-react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface CommentsSheetProps {
  postId: Id<"posts">;
}

interface CommentInputFooterProps {
  onSubmitComment: (text: string) => void;
}

// Separate memoized component for the input footer to prevent re-rendering issues
const CommentInputFooter: React.FC<CommentInputFooterProps> = memo(
  ({ onSubmitComment }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [commentText, setCommentText] = useState("");

    const handleSubmit = useCallback(() => {
      if (commentText.trim()) {
        onSubmitComment(commentText.trim());
        setCommentText("");
      }
    }, [commentText, onSubmitComment]);

    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(16),
        paddingBottom: Math.max(verticalScale(16), insets.bottom),
        shadowColor: theme.colors.text,
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: theme.colors.background,
        borderRadius: moderateScale(24),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        minHeight: verticalScale(48),
      },
      textInput: {
        flex: 1,
        fontSize: moderateScale(16),
        lineHeight: moderateScale(20),
        color: theme.colors.text,
        maxHeight: verticalScale(100),
        paddingVertical: verticalScale(8),
      },
      sendButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: moderateScale(20),
        width: scale(40),
        height: scale(40),
        justifyContent: "center",
        alignItems: "center",
        marginLeft: scale(8),
      },
      sendButtonDisabled: {
        backgroundColor: theme.colors.textMuted,
        opacity: 0.5,
      },
    });

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={styles.textInput}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            maxLength={150}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !commentText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={!commentText.trim()}
          >
            <Ionicons
              name="send"
              size={scale(18)}
              color={theme.colors.surface}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

CommentInputFooter.displayName = "CommentInputFooter";

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

const CommentItem: React.FC<{
  comment: CommentData;
  onMorePress: (commentId: Id<"comments">) => void;
  onLongPress: (commentId: Id<"comments">) => void;
}> = ({ comment, onMorePress, onLongPress }) => {
  const theme = useTheme();

  // No read more needed since we limit input to 150 characters
  const displayContent = comment.content;

  // Create long press gesture for deletion
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (comment.isOwner) {
        onLongPress(comment._id);
      }
    });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginVertical: verticalScale(6),
      borderRadius: moderateScale(16),
      padding: scale(16),
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    profileImage: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      marginRight: scale(12),
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    timeText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
    },
    commentText: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      color: theme.colors.text,
      marginBottom: verticalScale(4),
    },
    moreButton: {
      padding: scale(8),
      borderRadius: moderateScale(20),
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <GestureDetector gesture={longPressGesture}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={comment.user.profilePicture || undefined}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {comment.user.name}
            </Text>
            <Text style={styles.timeText}>
              {formatTimeAgo(comment._creationTime)}
            </Text>
          </View>
          {comment.isOwner && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => onMorePress(comment._id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={scale(16)}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.commentText}>{displayContent}</Text>
      </View>
    </GestureDetector>
  );
};

export const CommentsSheet = forwardRef<BottomSheetModal, CommentsSheetProps>(
  ({ postId }, ref) => {
    const theme = useTheme();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] =
      useState<Id<"comments"> | null>(null);

    // Convex hooks
    const commentPostMutation = useMutation(api.feed.commentPost);
    const deleteCommentMutation = useMutation(api.feed.deleteComment);

    // Paginated query for comments - only call when sheet is open
    const { results: comments, status } = usePaginatedQuery(
      api.feed.getComments,
      isSheetOpen ? { postId } : "skip",
      { initialNumItems: 20 }
    );

    const snapPoints = useMemo(() => ["80%", "100%"], []);
    const loading = status === "LoadingFirstPage";

    const handleMorePress = useCallback(
      (commentId: Id<"comments">) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
        // Dismiss the comments sheet
        if (typeof ref !== "function" && ref?.current) {
          ref.current.dismiss();
        }
      },
      [ref]
    );

    const handleLongPress = useCallback(
      (commentId: Id<"comments">) => {
        Alert.alert(
          "Delete Comment",
          "Are you sure you want to delete this comment?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  await deleteCommentMutation({ commentId });
                } catch (error) {
                  console.error("Failed to delete comment:", error);
                }
              },
            },
          ]
        );
      },
      [deleteCommentMutation]
    );

    const handleSubmitComment = useCallback(
      async (text: string) => {
        try {
          await commentPostMutation({ postId, content: text });
        } catch (error) {
          console.error("Failed to submit comment:", error);
        }
      },
      [commentPostMutation, postId]
    );

    const confirmDeleteComment = useCallback(async () => {
      if (commentToDelete) {
        try {
          await deleteCommentMutation({ commentId: commentToDelete });
          setCommentToDelete(null);
          setShowDeleteModal(false);
        } catch (error) {
          console.error("Failed to delete comment:", error);
        }
      }
    }, [commentToDelete, deleteCommentMutation]);

    const closeDeleteModal = useCallback(() => {
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }, []);

    const renderCommentItem = useCallback(
      ({ item }: { item: CommentData }) => (
        <CommentItem
          comment={item}
          onMorePress={handleMorePress}
          onLongPress={handleLongPress}
        />
      ),
      [handleMorePress, handleLongPress]
    );

    // Stable footer render function to prevent re-rendering issues
    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props}>
          <CommentInputFooter onSubmitComment={handleSubmitComment} />
        </BottomSheetFooter>
      ),
      [handleSubmitComment]
    );

    const renderLoader = () => (
      <View style={loaderStyles.container}>
        <LottieView
          source={require("@/assets/animations/spinner.json")}
          autoPlay
          loop
          style={loaderStyles.spinner}
        />
      </View>
    );

    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        flex: 1,
      },
      header: {
        alignItems: "center",
        paddingVertical: verticalScale(20),
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: "700",
        color: theme.colors.text,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(40),
      },
      emptyText: {
        fontSize: moderateScale(16),
        color: theme.colors.textMuted,
        textAlign: "center",
      },
    });

    const loaderStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(40),
      },
      spinner: {
        width: scale(40),
        height: scale(40),
      },
    });

    return (
      <>
        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
          keyboardBehavior="fillParent"
          enableDynamicSizing={false}
          footerComponent={renderFooter}
          onChange={(index) => setIsSheetOpen(index >= 0)}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Comments</Text>
            </View>

            {loading ? (
              renderLoader()
            ) : comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet</Text>
              </View>
            ) : (
              <BottomSheetFlashList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={renderCommentItem}
                estimatedItemSize={100}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: verticalScale(116),
                  paddingHorizontal: scale(8),
                }}
              />
            )}
          </View>
        </BottomSheetModal>

        <ConfirmationModal
          visible={showDeleteModal}
          icon="trash-outline"
          title="Delete Comment"
          description="Are you sure you want to delete this comment? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDeleteComment}
          onCancel={closeDeleteModal}
        />
      </>
    );
  }
);

CommentsSheet.displayName = "CommentsSheet";
