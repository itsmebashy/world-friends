import React, { useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ProfileCreationData, EditProfileData } from "@/validations/profile";
import { ItemPickerSheet, PickerItem } from "@/components/ItemPickerSheet";
import {
  COUNTRIES,
  LANGUAGES,
  getCountryByCode,
  getLanguageByCode,
} from "@/constants/user-data";

type LanguagesCountryFormData = ProfileCreationData | EditProfileData;

interface LanguagesCountryProps {
  control: Control<LanguagesCountryFormData>;
  errors: FieldErrors<LanguagesCountryFormData>;
}

export const LanguagesCountry: React.FC<LanguagesCountryProps> = ({
  control,
  errors,
}) => {
  const theme = useTheme();
  const countrySheetRef = useRef<BottomSheetModal>(null);
  const languagesSpokenSheetRef = useRef<BottomSheetModal>(null);
  const languagesLearningSheetRef = useRef<BottomSheetModal>(null);

  const countryItems: PickerItem[] = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        id: country.code,
        name: country.name,
        flag: country.flag,
        code: country.code,
      })),
    []
  );

  const languageItems: PickerItem[] = useMemo(
    () =>
      LANGUAGES.map((language) => ({
        id: language.code,
        name: language.name,
        code: language.code,
      })),
    []
  );

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
    button: {
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
    buttonError: {
      borderColor: theme.colors.error,
    },
    buttonContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    buttonText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    buttonPlaceholder: {
      color: theme.colors.textMuted,
    },
    flag: {
      fontSize: moderateScale(16),
      marginRight: scale(8),
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error,
      marginTop: verticalScale(4),
    },
    selectedItemsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: verticalScale(8),
      gap: scale(8),
    },
    selectedItem: {
      backgroundColor: theme.colors.primary + "15",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: scale(theme.borderRadius.sm),
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(6),
      flexDirection: "row",
      alignItems: "center",
    },
    selectedItemText: {
      fontSize: moderateScale(12),
      color: theme.colors.primary,
      fontWeight: "500",
      marginRight: scale(4),
    },
    removeButton: {
      marginLeft: scale(4),
    },
  });

  const renderSelectedCountry = (countryCode: string) => {
    const country = getCountryByCode(countryCode);
    if (!country) return null;

    return (
      <View style={styles.buttonContent}>
        <Text style={styles.flag}>{country.flag}</Text>
        <Text style={styles.buttonText}>{country.name}</Text>
      </View>
    );
  };

  const renderSelectedLanguages = (
    languageCodes: string[],
    onRemove: (code: string) => void
  ) => {
    if (languageCodes.length === 0) return null;

    return (
      <View style={styles.selectedItemsContainer}>
        {languageCodes.map((code) => {
          const language = getLanguageByCode(code);
          if (!language) return null;

          return (
            <View key={code} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{language.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(code)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={scale(14)}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Country Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Country *</Text>
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[styles.button, errors.country && styles.buttonError]}
                onPress={() => countrySheetRef.current?.present()}
                activeOpacity={0.7}
              >
                {value ? (
                  renderSelectedCountry(value)
                ) : (
                  <Text style={[styles.buttonText, styles.buttonPlaceholder]}>
                    Select your country
                  </Text>
                )}
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              <ItemPickerSheet
                ref={countrySheetRef}
                title="Select Country"
                items={countryItems}
                selectedItems={value ? [value] : []}
                onSelectionChange={(selected) => onChange(selected[0] || "")}
                multiSelect={false}
                searchable={true}
                placeholder="Search countries..."
              />
            </>
          )}
        />
        {errors.country && (
          <Text style={styles.errorText}>{errors.country.message}</Text>
        )}
      </View>

      {/* Languages Spoken */}
      <View style={styles.section}>
        <Text style={styles.label}>Languages Spoken *</Text>
        <Controller
          control={control}
          name="languagesSpoken"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  errors.languagesSpoken && styles.buttonError,
                ]}
                onPress={() => languagesSpokenSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (!value || value.length === 0) && styles.buttonPlaceholder,
                  ]}
                >
                  {value && value.length > 0
                    ? `${value.length} language${
                        value.length > 1 ? "s" : ""
                      } selected`
                    : "Select languages you speak"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {value &&
                value.length > 0 &&
                renderSelectedLanguages(value, (code) => {
                  const newValue = value.filter((lang) => lang !== code);
                  onChange(newValue);
                })}
              <ItemPickerSheet
                ref={languagesSpokenSheetRef}
                title="Languages Spoken"
                items={languageItems}
                selectedItems={value || []}
                onSelectionChange={onChange}
                multiSelect={true}
                searchable={true}
                placeholder="Search languages..."
              />
            </>
          )}
        />
        {errors.languagesSpoken && (
          <Text style={styles.errorText}>{errors.languagesSpoken.message}</Text>
        )}
      </View>

      {/* Languages Learning */}
      <View style={styles.section}>
        <Text style={styles.label}>Languages Learning *</Text>
        <Controller
          control={control}
          name="languagesLearning"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  errors.languagesLearning && styles.buttonError,
                ]}
                onPress={() => languagesLearningSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (!value || value.length === 0) && styles.buttonPlaceholder,
                  ]}
                >
                  {value && value.length > 0
                    ? `${value.length} language${
                        value.length > 1 ? "s" : ""
                      } selected`
                    : "Select languages you want to learn"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {value &&
                value.length > 0 &&
                renderSelectedLanguages(value, (code) => {
                  const newValue = value.filter((lang) => lang !== code);
                  onChange(newValue);
                })}
              <ItemPickerSheet
                ref={languagesLearningSheetRef}
                title="Languages Learning"
                items={languageItems}
                selectedItems={value || []}
                onSelectionChange={onChange}
                multiSelect={true}
                searchable={true}
                placeholder="Search languages..."
              />
            </>
          )}
        />
        {errors.languagesLearning && (
          <Text style={styles.errorText}>
            {errors.languagesLearning.message}
          </Text>
        )}
      </View>
    </View>
  );
};
