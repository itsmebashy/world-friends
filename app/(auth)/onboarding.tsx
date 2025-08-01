import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useThemeActions } from "@/stores/theme.store";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingScreen = () => {
  const theme = useTheme();
  const { toggleTheme } = useThemeActions();

  const handleInfoPress = () => {
    Toast.show({
      type: "info",
      text1: "Welcome to WorldFriends! 🌍",
      text2: "Your global friendship journey starts here",
      position: "top",
    });
  };

  const handleReadGuidelines = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem("onboarding_completed", "true");
      router.push("./guidelines");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save progress. Please try again.",
        position: "top",
      });
    }
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

      {/* Header with Info and Theme Toggle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={handleInfoPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.headerButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={theme.isDark ? "sunny-outline" : "moon-outline"}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo/Icon Section */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
              width={72}
              height={72}
            />
          </LinearGradient>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {[
            {
              icon: "people-outline",
              title: "Global Connections",
              description:
                "Meet amazing people from every corner of the world and build lasting friendships",
            },
            {
              icon: "language-outline",
              title: "Language Exchange",
              description:
                "Practice languages with native speakers and improve your communication skills",
            },
            {
              icon: "chatbubbles-outline",
              title: "Cultural Discovery",
              description:
                "Explore diverse cultures, traditions, and perspectives through meaningful conversations",
            },
          ].map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureItem,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: theme.colors.primaryLight + "20" },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text
                  style={[styles.featureTitle, { color: theme.colors.text }]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.guidelinesButton,
            {
              backgroundColor: theme.colors.primary,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={handleReadGuidelines}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>
              Read Guidelines
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors.white}
            />
          </LinearGradient>
        </Pressable>
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoGradient: {
    width: 150,
    height: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  guidelinesButton: {
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

export default OnboardingScreen;
