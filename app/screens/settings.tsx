import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { router } from "expo-router";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ActionItem } from "@/components/common/ActionItem";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import Toast from "react-native-toast-message";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SettingsScreen() {
  const theme = useTheme();
  const { signOut } = useAuthActions();
  const deleteProfile = useMutation(api.profiles.deleteProfile);

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditProfile = useCallback(() => {
    router.push("/screens/edit-profile");
  }, []);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
        position: "top",
      });
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "Failed to log out. Please try again.",
        position: "top",
      });
    }
  }, [signOut, router]);

  const handleDeleteAccount = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    try {
      await deleteProfile();
      await signOut();
      setShowDeleteModal(false);
      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been permanently deleted",
        position: "top",
      });
      router.replace("/");
    } catch (error) {
      console.error("Delete account error:", error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to delete account. Please try again.",
        position: "top",
      });
    }
  }, [deleteProfile, signOut, router]);

  const handleAppAbout = useCallback(() => {
    Alert.alert(
      "About WorldFriends",
      "WorldFriends v1.0.0\n\nConnect with people around the world, learn languages, and make meaningful friendships.\n\n© 2024 WorldFriends",
      [{ text: "OK", style: "default" }]
    );
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(40),
    },
    section: {
      marginBottom: verticalScale(32),
    },
    sectionTitle: {
      fontSize: moderateScale(18),
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: verticalScale(16),
      marginLeft: scale(4),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Settings" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <ActionItem
            icon="person-outline"
            iconColor={theme.colors.primary}
            iconBgColor={`${theme.colors.primary}15`}
            title="Edit Profile"
            description="Update your profile information and preferences"
            type="navigation"
            onPress={handleEditProfile}
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <ActionItem
            icon="log-out-outline"
            iconColor={theme.colors.warning}
            iconBgColor={`${theme.colors.warning}15`}
            title="Logout"
            description="Sign out of your account"
            type="navigation"
            onPress={handleLogout}
          />

          <ActionItem
            icon="trash-outline"
            iconColor={theme.colors.error}
            iconBgColor={`${theme.colors.error}15`}
            title="Delete Account"
            description="Permanently delete your account and data"
            type="navigation"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <ActionItem
            icon="information-circle-outline"
            iconColor={theme.colors.info}
            iconBgColor={`${theme.colors.info}15`}
            title="App Information"
            description="Version, terms, and privacy policy"
            type="navigation"
            onPress={handleAppAbout}
          />
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        icon="log-out-outline"
        title="Logout"
        description="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
        confirmLabel="Proceed"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}
