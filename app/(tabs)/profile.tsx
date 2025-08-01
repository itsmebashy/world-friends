import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { TabHeader } from "@/components/TabHeader";
import { UserInfo } from "@/components/profile/UserInfo";
import { ProfileItem } from "@/components/profile/ProfileItem";
import { ActionItem } from "@/components/common/ActionItem";
import { ScreenLoading } from "@/components/ScreenLoading";
import { useProfile } from "@/hooks/useProfile";

export default function ProfileScreen() {
  const {
    // Profile data
    profileData,

    // Theme
    theme,

    // Navigation handlers
    handleNotificationPress,
    handleMyPostsPress,
    handleSettingsPress,

    // Theme handlers
    handleThemeToggle,
  } = useProfile();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContainer: {
          flex: 1,
        },
        contentContainer: {
          paddingTop: verticalScale(100), // Account for fixed header
        },
        bottomSection: {
          paddingHorizontal: scale(20),
          paddingTop: verticalScale(20),
          paddingBottom: verticalScale(100),
        },
      }),
    [theme]
  );

  // If profileData is null or undefined, the useProfile hook will redirect to create-profile
  if (!profileData) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.contentContainer}
      >
        <UserInfo
          profilePicture={profileData.profilePictureUrl || ""}
          name={profileData.name}
          username={profileData.userName}
          gender={profileData.gender}
          age={profileData.age}
          countryCode={profileData.countryCode}
        />

        <ProfileItem
          type="about"
          title="About Me"
          icon="person"
          data={{ aboutMe: profileData.aboutMe }}
        />

        <ProfileItem
          type="languages"
          title="Languages"
          icon="language"
          data={{
            spokenLanguages: profileData.spokenLanguagesCodes,
            learningLanguages: profileData.learningLanguagesCodes,
          }}
        />

        <ProfileItem
          type="travel"
          title="Travel"
          icon="airplane"
          data={{
            visitedCountries: profileData.visitedCountryCodes,
            wantToVisitCountries: profileData.wantToVisitCountryCodes,
          }}
        />

        <ProfileItem
          type="hobbies"
          title="Hobbies & Interests"
          icon="heart"
          data={{ hobbies: profileData.hobbies }}
        />

        <ProfileItem
          type="books"
          title="Favorite Books"
          icon="library"
          data={{ books: profileData.favoriteBooks }}
        />

        <View style={styles.bottomSection}>
          <ActionItem
            icon={theme.isDark ? "sunny-outline" : "moon-outline"}
            iconColor={theme.colors.warning}
            iconBgColor={`${theme.colors.warning}15`}
            title="Theme"
            description={`Currently using ${
              theme.isDark ? "dark" : "light"
            } theme`}
            type="toggle"
            value={theme.isDark}
            onValueChange={handleThemeToggle}
          />

          <ActionItem
            icon="grid-outline"
            iconColor={theme.colors.primary}
            iconBgColor={`${theme.colors.primary}15`}
            title="My Posts"
            description="View and manage your posts"
            type="navigation"
            onPress={handleMyPostsPress}
          />

          <ActionItem
            icon="settings-outline"
            iconColor={theme.colors.primary}
            iconBgColor={`${theme.colors.primary}15`}
            title="Settings"
            description="App preferences and configuration"
            type="navigation"
            onPress={handleSettingsPress}
          />
        </View>
      </ScrollView>
      <TabHeader
        title="Profile"
        onNotificationPress={handleNotificationPress}
        hasNotification={false}
      />
    </SafeAreaView>
  );
}
