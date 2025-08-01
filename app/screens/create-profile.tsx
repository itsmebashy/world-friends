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
import { useCreateProfile } from "@/hooks/useCreateProfile";

export default function CreateProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    currentStep,
    scrollViewRef,
    isCreating,
    control,
    errors,
    currentStepData,
    isLastStep,
    isFirstStep,
    progressPercentage,
    handleNext,
    handleBack,
    getButtonText,
    STEPS,
    LoadingModal,
  } = useCreateProfile();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    stepContainer: {
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(20),
    },
    progressContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
    },
    progressBar: {
      height: verticalScale(4),
      backgroundColor: theme.colors.border,
      borderRadius: scale(2),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.success,
      borderRadius: scale(2),
    },
    progressText: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: verticalScale(8),
    },
    buttonContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
      paddingBottom: insets.bottom + verticalScale(16),
    },
    buttonRow: {
      flexDirection: "row",
      gap: scale(12),
    },
    button: {
      flex: 1,
      paddingVertical: verticalScale(16),
      borderRadius: scale(theme.borderRadius.md),
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
    },
    primaryButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    secondaryButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
    },
    primaryButtonText: {
      color: theme.colors.white,
    },
    primaryButtonTextDisabled: {
      color: theme.colors.textMuted,
    },
    secondaryButtonText: {
      color: theme.colors.text,
    },
  });

  const CurrentStepComponent = currentStepData?.component;

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <ScreenHeader
        title={currentStepData?.title || "Create Profile"}
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

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              {!isFirstStep && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleBack}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Back
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  // Add disabled state styling if needed
                ]}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {getButtonText()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <LoadingModal
        visible={isCreating}
        isCreating={true}
        loadingAnimation={require("@/assets/animations/create-update.json")}
      />
    </SafeAreaView>
  );
}
