import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useEditProfile } from "@/hooks/useEditProfile";

export default function EditProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    currentStep,
    scrollViewRef,
    isUpdating,
    control,
    errors,
    currentStepData,
    isFirstStep,
    isLastStep,
    progressPercentage,
    handleNext,
    handleBack,
    getButtonText,
    STEPS,
    LoadingModal,
  } = useEditProfile();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    progressContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
    },
    progressBar: {
      height: verticalScale(6),
      backgroundColor: theme.colors.borderLight,
      borderRadius: scale(theme.borderRadius.full),
      overflow: "hidden",
      marginBottom: verticalScale(8),
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: scale(theme.borderRadius.full),
    },
    progressText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      textAlign: "center",
    },
    scrollContainer: {
      flex: 1,
    },
    stepContainer: {
      flex: 1,
      paddingBottom: verticalScale(100), // Space for button
    },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      paddingHorizontal: scale(20),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(16) + insets.bottom,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    buttonRow: {
      flexDirection: "row",
      gap: scale(12),
    },
    button: {
      flex: 1,
      paddingVertical: verticalScale(16),
      borderRadius: scale(theme.borderRadius.lg),
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    primaryButtonText: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.white,
    },
    secondaryButtonText: {
      fontSize: moderateScale(18),
      fontWeight: "600",
      color: theme.colors.text,
    },
  });

  const CurrentStepComponent = currentStepData?.component;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScreenHeader
        title={currentStepData?.title || "Edit Profile"}
        onBack={handleBack}
      />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {STEPS.length}
        </Text>
      </View>

      {/* Wrap ScrollView in KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        {/* Step Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.stepContainer}>
            {CurrentStepComponent && (
              <CurrentStepComponent control={control} errors={errors} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Button */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {!isFirstStep && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Modal */}
      <LoadingModal
        visible={isUpdating}
        isCreating={false}
        loadingAnimation={require("@/assets/animations/create-update.json")}
      />
    </SafeAreaView>
  );
}
