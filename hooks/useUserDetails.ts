import { useState, useRef, useCallback, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useTheme } from "@/stores/theme.store";
import { ActionSheetOption } from "@/components/common/ActionSheet";

export const useUserDetails = (profileId: Id<"profiles"> | undefined) => {
  // State
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  // Refs
  const actionSheetRef = useRef<BottomSheetModal>(null);

  // Theme
  const theme = useTheme();

  // Convex queries and mutations
  const userProfile = useQuery(
    api.userManagement.getUserProfile,
    profileId && !isBlocking ? { profileId } : "skip"
  );

  const blockUserMutation = useMutation(api.userManagement.blockUser);

  // Loading state
  const loading = userProfile === undefined && !isBlocking;

  // Action handlers
  const handleEllipsisPress = useCallback(() => {
    actionSheetRef.current?.present();
  }, []);

  const handleBlockUser = useCallback(() => {
    setShowBlockConfirmation(true);
  }, []);

  const handleConfirmBlock = useCallback(async () => {
    if (!profileId) return;

    setIsBlocking(true);
    setShowBlockConfirmation(false);

    try {
      await blockUserMutation({ profileId });

      Toast.show({
        type: "success",
        text1: "User Blocked",
        text2: "You will no longer see this user",
        position: "top",
      });

      // Navigate back to previous screen or discover tab
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/discover");
      }
    } catch (error) {
      setIsBlocking(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to block user. Please try again.",
        position: "top",
      });
    }
  }, [profileId, blockUserMutation]);

  const handleCancelBlock = useCallback(() => {
    setShowBlockConfirmation(false);
  }, []);

  const handleFriendAction = useCallback(() => {
    if (!userProfile) return;

    if (userProfile.isFriend) {
      console.log("Remove friend action triggered");
      // TODO: Implement remove friend functionality
    } else {
      console.log("Add friend action triggered");
      // TODO: Implement add friend functionality
    }
  }, [userProfile]);

  const handleUserPostsPress = useCallback(() => {
    if (!userProfile) return;

    if (!userProfile.isFriend) {
      Toast.show({
        type: "error",
        text1: "Access Restricted",
        text2: "You need to be friends to view their posts",
        position: "top",
      });
      return;
    }

    // Navigate to user posts screen
    router.push(`/screens/user-posts/${userProfile.userId}` as any);
  }, [userProfile]);

  // Action sheet options
  const actionSheetOptions: ActionSheetOption[] = useMemo(
    () => [
      {
        id: "block-user",
        title: "Block User",
        icon: "ban",
        color: theme.colors.error,
        onPress: handleBlockUser,
      },
    ],
    [theme.colors.error, handleBlockUser]
  );

  return {
    // State
    userProfile,
    loading,
    showBlockConfirmation,
    isBlocking,

    // Refs
    actionSheetRef,

    // Actions
    handleEllipsisPress,
    handleBlockUser,
    handleConfirmBlock,
    handleCancelBlock,
    handleFriendAction,
    handleUserPostsPress,

    // Options
    actionSheetOptions,
  };
};
