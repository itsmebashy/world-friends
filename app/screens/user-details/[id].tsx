import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { UserInfo } from "@/components/profile/UserInfo";
import { ProfileItem } from "@/components/profile/ProfileItem";
import { ActionItem } from "@/components/common/ActionItem";
import { ActionSheet } from "@/components/common/ActionSheet";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useUserDetails } from "@/hooks/useUserDetails";
import { Id } from "@/convex/_generated/dataModel";

export default function UserDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Convert string ID to profile ID type
  const profileId = id as Id<"profiles">;

  const {
    // State
    userProfile,
    loading,
    showBlockConfirmation,
    isBlocking,

    // Refs
    actionSheetRef,

    // Actions
    handleEllipsisPress,
    handleConfirmBlock,
    handleCancelBlock,
    handleFriendAction,
    handleUserPostsPress,

    // Options
    actionSheetOptions,
  } = useUserDetails(profileId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContainer: {
      flex: 1,
      paddingBottom: verticalScale(20),
    },
    friendActionContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
    },
    friendButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(14),
      borderRadius: scale(theme.borderRadius.lg),
      gap: scale(8),
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    addFriendButton: {
      backgroundColor: theme.colors.primary,
    },
    removeFriendButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    friendButtonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
    },
    addFriendButtonText: {
      color: theme.colors.white,
    },
    removeFriendButtonText: {
      color: theme.colors.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: scale(40),
    },
    errorText: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: verticalScale(16),
    },
    bottomSection: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(20),
    },
  });

  if (loading || isBlocking) {
    return <ScreenLoading />;
  }

  if (!userProfile) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <ScreenHeader
          title="Profile"
          rightComponent="ellipsis"
          onRightPress={handleEllipsisPress}
        />
        <View style={styles.errorContainer}>
          <Ionicons
            name="person-circle-outline"
            size={scale(80)}
            color={theme.colors.textMuted}
          />
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title={`${userProfile.name}`}
        rightComponent="ellipsis"
        onRightPress={handleEllipsisPress}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <UserInfo
          profilePicture={userProfile.profilePicture}
          name={userProfile.name}
          username={userProfile.username}
          gender={userProfile.gender}
          age={userProfile.age}
          countryCode={userProfile.countryCode}
        />

        <View style={styles.friendActionContainer}>
          <TouchableOpacity
            style={[
              styles.friendButton,
              userProfile.isFriend
                ? styles.removeFriendButton
                : styles.addFriendButton,
            ]}
            onPress={handleFriendAction}
            activeOpacity={0.7}
          >
            <Ionicons
              name={userProfile.isFriend ? "person-remove" : "person-add"}
              size={scale(20)}
              color={
                userProfile.isFriend ? theme.colors.text : theme.colors.white
              }
            />
            <Text
              style={[
                styles.friendButtonText,
                userProfile.isFriend
                  ? styles.removeFriendButtonText
                  : styles.addFriendButtonText,
              ]}
            >
              {userProfile.isFriend ? "Remove Friend" : "Add Friend"}
            </Text>
          </TouchableOpacity>
        </View>

        <ProfileItem
          type="about"
          title="About Me"
          icon="person-circle"
          data={{ aboutMe: userProfile.aboutMe }}
        />

        <ProfileItem
          type="languages"
          title="Languages"
          icon="language"
          data={{
            spokenLanguages: userProfile.spokenLanguageCodes,
            learningLanguages: userProfile.learningLanguageCodes,
          }}
        />

        {(userProfile.visitedCountryCodes ||
          userProfile.wantToVisitCountryCodes) && (
          <ProfileItem
            type="travel"
            title="Travel"
            icon="airplane"
            data={{
              visitedCountries: userProfile.visitedCountryCodes,
              wantToVisitCountries: userProfile.wantToVisitCountryCodes,
            }}
          />
        )}

        {userProfile.favoriteBooks && userProfile.favoriteBooks.length > 0 && (
          <ProfileItem
            type="books"
            title="Favorite Books"
            icon="library"
            data={{ books: userProfile.favoriteBooks }}
          />
        )}

        <View style={styles.bottomSection}>
          <ActionItem
            icon="grid-outline"
            iconColor={theme.colors.primary}
            iconBgColor={`${theme.colors.primary}15`}
            title="User Posts"
            description="View their posts and updates"
            type="navigation"
            onPress={handleUserPostsPress}
          />
        </View>
      </ScrollView>

      <ActionSheet ref={actionSheetRef} options={actionSheetOptions} />

      <ConfirmationModal
        visible={showBlockConfirmation}
        icon="ban"
        title="Block User"
        description="You will never be able to contact this user again. This action cannot be undone."
        confirmLabel="Block"
        cancelLabel="Cancel"
        onConfirm={handleConfirmBlock}
        onCancel={handleCancelBlock}
      />
    </SafeAreaView>
  );
}
