import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ProfileCreationData, EditProfileData } from "@/validations/profile";
import { ImagePickerSheet } from "@/components/common/ImagePickerSheet";

type FinalizeFormData = ProfileCreationData | EditProfileData;

interface FinalizeProps {
  control: Control<FinalizeFormData>;
  errors: FieldErrors<FinalizeFormData>;
}

export const Finalize: React.FC<FinalizeProps> = ({ control, errors }) => {
  const theme = useTheme();
  const imagePickerSheetRef = useRef<BottomSheetModal>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
    },
    section: {
      marginBottom: verticalScale(24),
    },
    label: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
    },
    description: {
      fontSize: moderateScale(13),
      color: theme.colors.textSecondary,
      marginBottom: verticalScale(12),
      lineHeight: moderateScale(14),
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error,
      marginTop: verticalScale(4),
    },
    profilePictureContainer: {
      alignItems: "center",
      marginBottom: verticalScale(16),
    },
    profilePictureButton: {
      width: scale(120),
      height: scale(120),
      borderRadius: scale(60),
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(12),
    },
    profilePictureButtonError: {
      borderColor: theme.colors.error,
    },
    profilePictureButtonSelected: {
      borderColor: theme.colors.primary,
      borderStyle: "solid",
    },
    profilePicture: {
      width: scale(116),
      height: scale(116),
      borderRadius: scale(58),
    },
    profilePictureIcon: {
      marginBottom: verticalScale(8),
    },
    profilePictureText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      textAlign: "center",
      fontWeight: "500",
    },
    changePhotoButton: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
      backgroundColor: theme.colors.primary + "15",
      borderRadius: scale(theme.borderRadius.md),
    },
    changePhotoText: {
      fontSize: moderateScale(12),
      color: theme.colors.primary,
      fontWeight: "600",
    },
    toggleContainer: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
    },
    toggleHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: verticalScale(8),
    },
    toggleTitle: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
      marginRight: scale(12),
    },
    toggleDescription: {
      fontSize: moderateScale(12),
      color: theme.colors.textSecondary,
      lineHeight: moderateScale(18),
    },
    finishSection: {
      alignItems: "center",
      paddingVertical: verticalScale(20),
    },
    finishIcon: {
      marginBottom: verticalScale(16),
    },
    finishTitle: {
      fontSize: moderateScale(18),
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      textAlign: "center",
    },
    finishDescription: {
      fontSize: moderateScale(13),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: moderateScale(14),
    },
  });

  const handleImageSelected = (imageUri: string) => {
    setSelectedImageUri(imageUri);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.section}>
        <View style={styles.finishSection}>
          <Ionicons
            name="checkmark-circle"
            size={scale(48)}
            color={theme.colors.success}
            style={styles.finishIcon}
          />
          <Text style={styles.finishTitle}>Almost Done!</Text>
          <Text style={styles.finishDescription}>
            Add a profile picture and set your preferences to complete your
            profile setup.
          </Text>
        </View>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Profile Picture *</Text>
        <Text style={styles.description}>
          Choose a clear photo of yourself. This helps others recognize and
          connect with you.
        </Text>
        <Controller
          control={control}
          name="profilePicture"
          render={({ field: { onChange, value } }) => (
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                style={[
                  styles.profilePictureButton,
                  errors.profilePicture && styles.profilePictureButtonError,
                  (selectedImageUri || value) &&
                    styles.profilePictureButtonSelected,
                ]}
                onPress={() => imagePickerSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                {selectedImageUri || value ? (
                  <Image
                    source={{ uri: selectedImageUri || value }}
                    style={styles.profilePicture}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="camera"
                      size={scale(32)}
                      color={theme.colors.textMuted}
                      style={styles.profilePictureIcon}
                    />
                    <Text style={styles.profilePictureText}>Add Photo</Text>
                  </>
                )}
              </TouchableOpacity>
              {(selectedImageUri || value) && (
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={() => imagePickerSheetRef.current?.present()}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              )}
              <ImagePickerSheet
                ref={imagePickerSheetRef}
                onImageSelected={(imageUri) => {
                  handleImageSelected(imageUri);
                  onChange(imageUri);
                }}
              />
            </View>
          )}
        />
        {errors.profilePicture && (
          <Text style={styles.errorText}>{errors.profilePicture.message}</Text>
        )}
      </View>

      {/* Gender Preference Toggle */}
      <View style={styles.section}>
        <Text style={styles.label}>Privacy Preferences</Text>
        <Controller
          control={control}
          name="genderPreference"
          render={({ field: { onChange, value } }) => (
            <View style={styles.toggleContainer}>
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleTitle}>Same Gender Only</Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary + "40",
                  }}
                  thumbColor={
                    value ? theme.colors.primary : theme.colors.textMuted
                  }
                />
              </View>
              <Text style={styles.toggleDescription}>
                When enabled, only users of the same gender will see your
                profile, and you will only see profiles of the same gender in
                the app.
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
