import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AuthIndex() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useState(false);

  useEffect(() => {
    checkAuthFlow();
  }, []);

  const checkAuthFlow = async () => {
    try {
      const [onboardingStatus, guidelinesStatus] = await Promise.all([
        AsyncStorage.getItem("onboarding_completed"),
        AsyncStorage.getItem("guidelines_accepted"),
      ]);

      setHasSeenOnboarding(onboardingStatus === "true");
      setHasAcceptedGuidelines(guidelinesStatus === "true");
    } catch (error) {
      console.error("Error checking auth flow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If user hasn't seen onboarding, show onboarding
  if (!hasSeenOnboarding) {
    return <Redirect href="./onboarding" />;
  }

  // If user hasn't accepted guidelines, show guidelines
  if (!hasAcceptedGuidelines) {
    return <Redirect href="./guidelines" />;
  }

  // If user has completed onboarding and guidelines, show login
  return <Redirect href="./login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
