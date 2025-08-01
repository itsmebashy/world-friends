import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useQuery } from "convex/react";
import { useDebounce } from "use-debounce";
import { useTheme } from "@/stores/theme.store";
import { ProfileCreationData } from "@/validations/profile";
import { api } from "@/convex/_generated/api";

interface BasicInfoProps {
  control: Control<ProfileCreationData>;
  errors: FieldErrors<ProfileCreationData>;
}

const GENDER_OPTIONS = [
  { id: "male", label: "Male", icon: "male" as const },
  { id: "female", label: "Female", icon: "female" as const },
  { id: "other", label: "Other", icon: "transgender" as const },
];

export const BasicInfo: React.FC<BasicInfoProps> = ({ control, errors }) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 1000);

  // Check username availability with debounce
  const isUsernameAvailable = useQuery(
    api.profiles.checkUsernameAvailability,
    debouncedUsername && debouncedUsername.length >= 3
      ? { userName: debouncedUsername }
      : "skip"
  );

  const getUsernameStatus = () => {
    if (!username || username.length < 3) return null;
    if (debouncedUsername !== username) return "checking";
    if (isUsernameAvailable === undefined) return "checking";
    return isUsernameAvailable ? "available" : "taken";
  };

  const usernameStatus = getUsernameStatus();

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
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error,
      marginTop: verticalScale(4),
    },
    successText: {
      fontSize: moderateScale(12),
      color: theme.colors.success,
      marginTop: verticalScale(4),
    },
    genderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: scale(12),
    },
    genderOption: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingVertical: verticalScale(16),
      alignItems: "center",
      justifyContent: "center",
    },
    genderOptionSelected: {
      backgroundColor: theme.colors.primary + "15",
      borderColor: theme.colors.primary,
    },
    genderIcon: {
      marginBottom: verticalScale(4),
    },
    genderText: {
      fontSize: moderateScale(13),
      fontWeight: "500",
      color: theme.colors.text,
    },
    genderTextSelected: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    dateButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateButtonError: {
      borderColor: theme.colors.error,
    },
    dateText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    datePlaceholder: {
      color: theme.colors.textMuted,
    },
    usernameContainer: {
      position: "relative",
    },
    usernameStatusContainer: {
      position: "absolute",
      right: scale(16),
      top: "50%",
      transform: [{ translateY: -scale(12) }],
      zIndex: 1,
    },
    inputWithStatus: {
      paddingRight: scale(50),
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* Name Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Name *</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your first name"
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

      {/* Username Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Username *</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.usernameContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputWithStatus,
                  errors.username && styles.inputError,
                ]}
                placeholder="Enter your username"
                placeholderTextColor={theme.colors.textMuted}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setUsername(text);
                }}
                onBlur={onBlur}
                maxLength={12}
                autoCapitalize="none"
              />
              <View style={styles.usernameStatusContainer}>
                {usernameStatus === "checking" && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                )}
                {usernameStatus === "available" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={scale(20)}
                    color={theme.colors.success}
                  />
                )}
                {usernameStatus === "taken" && (
                  <Ionicons
                    name="close-circle"
                    size={scale(20)}
                    color={theme.colors.error}
                  />
                )}
              </View>
            </View>
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}
        {usernameStatus === "taken" && !errors.username && (
          <Text style={styles.errorText}>Username is already taken</Text>
        )}
        {usernameStatus === "available" && !errors.username && (
          <Text style={styles.successText}>Username is available!</Text>
        )}
      </View>

      {/* Gender Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Gender *</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View style={styles.genderContainer}>
              {GENDER_OPTIONS.map((option) => {
                const isSelected = value === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.genderOption,
                      isSelected && styles.genderOptionSelected,
                    ]}
                    onPress={() => onChange(option.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={option.icon}
                      size={scale(24)}
                      color={
                        isSelected
                          ? theme.colors.primary
                          : theme.colors.textMuted
                      }
                      style={styles.genderIcon}
                    />
                    <Text
                      style={[
                        styles.genderText,
                        isSelected && styles.genderTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.gender && (
          <Text style={styles.errorText}>{errors.gender.message}</Text>
        )}
      </View>

      {/* Birthdate Picker */}
      <View style={styles.section}>
        <Text style={styles.label}>Birthdate *</Text>
        <Controller
          control={control}
          name="birthdate"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  errors.birthdate && styles.dateButtonError,
                ]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dateText, !value && styles.datePlaceholder]}
                >
                  {value ? formatDate(value) : "Select your birthdate"}
                </Text>
                <Ionicons
                  name="calendar"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1924, 0, 1)}
                />
              )}
            </>
          )}
        />
        {errors.birthdate && (
          <Text style={styles.errorText}>{errors.birthdate.message}</Text>
        )}
      </View>
    </View>
  );
};
