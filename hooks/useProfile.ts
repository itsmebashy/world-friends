import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { useTheme, useThemeActions } from "@/stores/theme.store";
import { api } from "@/convex/_generated/api";

export const useProfile = () => {
  const theme = useTheme();
  const { toggleTheme } = useThemeActions();
  const router = useRouter();
  // Get current user profile from Convex
  const profileData = useQuery(api.profiles.getCurrentProfile);

  // Check if user needs to create profile
  useEffect(() => {
    if (profileData === null) {
      // User is authenticated but has no profile, redirect to create profile
      router.replace("/screens/create-profile");
    }
  }, [profileData, router]);

  // Navigation handlers
  const handleNotificationPress = useCallback(() => {
    console.log("Notification pressed");
  }, []);

  const handleMyPostsPress = useCallback(() => {
    if (profileData?.userId) {
      router.push(`/screens/user-posts/${profileData.userId}` as any);
    }
  }, [profileData?.userId, router]);

  const handleSettingsPress = useCallback(() => {
    router.push("/screens/settings");
  }, [router]);

  // Theme handlers
  const handleThemeToggle = useCallback(
    (_value: boolean) => {
      toggleTheme();
    },
    [toggleTheme]
  );

  return {
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
  };
};
