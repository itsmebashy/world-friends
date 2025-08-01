import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/stores/theme.store";
import { COMMUNITY_GUIDELINES } from "@/constants/guidelines";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GuidelinesScreen = () => {
  const theme = useTheme();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleSignup = async () => {
    if (!isAccepted) {
      Toast.show({
        type: "error",
        text1: "Guidelines Required ❌",
        text2: "Please accept the guidelines to continue",
        position: "top",
      });
      return;
    }

    try {
      // Mark guidelines as accepted
      await AsyncStorage.setItem("guidelines_accepted", "true");

      Toast.show({
        type: "success",
        text1: "Welcome Aboard! 🎉",
        text2: "Guidelines accepted successfully",
        position: "top",
      });

      // Navigate to signup screen
      router.push("./signup");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save preferences. Please try again.",
        position: "top",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={
          theme.isDark
            ? [
                theme.colors.background,
                theme.colors.surface,
                theme.colors.background,
              ]
            : [
                theme.colors.background,
                theme.colors.surface,
                theme.colors.background,
              ]
        }
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Community Guidelines
        </Text>

        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View
          style={[
            styles.introContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <LinearGradient
            colors={[
              theme.colors.primary + "20",
              theme.colors.primaryLight + "10",
            ]}
            style={styles.introGradient}
          >
            <Ionicons
              name="shield-checkmark"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>
              Safe Community Standards
            </Text>
            <Text
              style={[
                styles.introDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Please read and accept our community guidelines to ensure a safe
              and welcoming environment for everyone.
            </Text>
          </LinearGradient>
        </View>

        {/* Guidelines List */}
        <View style={styles.guidelinesContainer}>
          {COMMUNITY_GUIDELINES.map((guideline) => (
            <View
              key={guideline.id}
              style={[
                styles.guidelineItem,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.guidelineIcon,
                  { backgroundColor: theme.colors.primary + "15" },
                ]}
              >
                <Ionicons
                  name={guideline.icon as any}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.guidelineContent}>
                <Text
                  style={[styles.guidelineTitle, { color: theme.colors.text }]}
                >
                  {guideline.title}
                </Text>
                <Text
                  style={[
                    styles.guidelineDescription,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {guideline.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsAccepted(!isAccepted)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: isAccepted
                    ? theme.colors.primary
                    : "transparent",
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              {isAccepted && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={theme.colors.white}
                />
              )}
            </View>
            <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
              I agree to the community guidelines
            </Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <Pressable
            style={({ pressed }) => [
              styles.signupButton,
              {
                backgroundColor: isAccepted
                  ? theme.colors.primary
                  : theme.colors.textMuted,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            onPress={handleSignup}
          >
            <LinearGradient
              colors={
                isAccepted
                  ? [theme.colors.primary, theme.colors.primaryDark]
                  : [theme.colors.textMuted, theme.colors.textMuted]
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Continue to Signup
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={theme.colors.white}
              />
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  introContainer: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  introGradient: {
    padding: 24,
    alignItems: "center",
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  introDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.8,
  },
  guidelinesContainer: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },

  guidelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  guidelineContent: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  guidelineDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  bottomContainer: {
    paddingVertical: 20,
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  signupButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default GuidelinesScreen;
