import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AddImageSection } from "@/components/feed/AddImageSection";
import { ImagePickerSheet } from "@/components/common/ImagePickerSheet";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { useCreatePost } from "@/hooks/useCreatePost";

export default function CreatePostScreen() {
  const theme = useTheme();

  const {
    // State
    content,
    image,
    showDiscardModal,
    showPostModal,
    isCreating,

    // Refs
    imagePickerRef,

    // Computed values
    characterCount,
    canPost,

    // Content handlers
    setContent,

    // Navigation handlers
    handleBack,

    // Post creation handlers
    handlePost,
    confirmPost,
    confirmDiscard,

    // Image handlers
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,

    // Modal handlers
    closeDiscardModal,
    closePostModal,

    // Utility functions
    getCounterColor,
  } = useCreatePost();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
    },
    textInputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(16),
      minHeight: verticalScale(200),
      position: "relative",
    },
    textInput: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      lineHeight: moderateScale(14),
      textAlignVertical: "top",
      flex: 1,
    },
    characterCounter: {
      position: "absolute",
      bottom: scale(12),
      right: scale(12),
      fontSize: moderateScale(12),
      fontWeight: "500",
    },
    placeholder: {
      fontSize: moderateScale(16),
      color: theme.colors.textMuted,
      position: "absolute",
      top: scale(20),
      left: scale(16),
      pointerEvents: "none",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title="Create Post"
        onBack={handleBack}
        rightComponent="button"
        onRightPress={handlePost}
        rightButtonEnabled={canPost}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={2000}
            placeholder="What's on your mind? Share your thoughts with friends..."
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
          />
          <Text
            style={[styles.characterCounter, { color: getCounterColor(theme) }]}
          >
            {characterCount}/2000
          </Text>
        </View>

        <AddImageSection
          image={image}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
        />
      </ScrollView>

      <ImagePickerSheet
        ref={imagePickerRef}
        onImageSelected={handleImageSelected}
      />

      <ConfirmationModal
        visible={showDiscardModal}
        icon="warning-outline"
        title="Discard Post"
        description="Are you sure you want to discard this post? Your changes will be lost."
        confirmLabel="Discard"
        cancelLabel="Continue"
        onConfirm={confirmDiscard}
        onCancel={closeDiscardModal}
      />

      <ConfirmationModal
        visible={showPostModal}
        icon="checkmark-circle-outline"
        title="Create Post"
        description="Are you ready to share this post with your friends?"
        confirmLabel="Post"
        cancelLabel="Cancel"
        onConfirm={confirmPost}
        onCancel={closePostModal}
      />

      <LoadingModal
        visible={isCreating}
        isCreating={true}
        loadingAnimation={require("@/assets/animations/create-post.json")}
      />
    </SafeAreaView>
  );
}
