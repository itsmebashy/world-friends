import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useQuery } from "convex/react";
import { useTheme } from "@/stores/theme.store";
import { EditProfileData } from "@/validations/profile";
import { api } from "@/convex/_generated/api";

interface EditBasicInfoProps {
  control: Control<EditProfileData>;
  errors: FieldErrors<EditProfileData>;
}

export const EditBasicInfo: React.FC<EditBasicInfoProps> = ({
  control,
  errors,
}) => {
  const theme = useTheme();
  const profileData = useQuery(api.profiles.getCurrentProfile);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to capitalize gender
  const capitalizeGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

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
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      fontSize: moderateScale(16),
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    inputError: {
      borderColor: theme.colors.error,
      backgroundColor: `${theme.colors.error}08`,
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error,
      marginTop: verticalScale(4),
      marginLeft: scale(4),
    },
    infoContainer: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: scale(theme.borderRadius.md),
      padding: scale(16),
      marginBottom: verticalScale(24),
    },
    infoText: {
      fontSize: moderateScale(14),
      color: theme.colors.textMuted,
      lineHeight: moderateScale(14),
      textAlign: "center",
    },
    readOnlySection: {
      marginBottom: verticalScale(24),
    },
    readOnlyLabel: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.textMuted,
      marginBottom: verticalScale(8),
    },
    readOnlyValue: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      fontSize: moderateScale(16),
      color: theme.colors.textMuted,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
  });

  return (
    <View style={styles.container}>
      {/* Info Message */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          You can update your name, but username, gender, and birthdate cannot
          be changed for security and privacy reasons.
        </Text>
      </View>

      {/* Name Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Name *</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textMuted}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={12}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      {/* Read-only Username */}
      <View style={styles.readOnlySection}>
        <Text style={styles.readOnlyLabel}>Username</Text>
        <Text style={styles.readOnlyValue}>
          @{profileData?.userName || "loading..."}
        </Text>
      </View>

      {/* Read-only Gender */}
      <View style={styles.readOnlySection}>
        <Text style={styles.readOnlyLabel}>Gender</Text>
        <Text style={styles.readOnlyValue}>
          {profileData?.gender
            ? capitalizeGender(profileData.gender)
            : "loading..."}
        </Text>
      </View>

      {/* Read-only Birthdate */}
      <View style={styles.readOnlySection}>
        <Text style={styles.readOnlyLabel}>Birthdate</Text>
        <Text style={styles.readOnlyValue}>
          {profileData?.birthDate
            ? formatDate(profileData.birthDate)
            : "loading..."}
        </Text>
      </View>
    </View>
  );
};
