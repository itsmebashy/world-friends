import React, { useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ProfileCreationData, EditProfileData } from "@/validations/profile";
import { ItemPickerSheet, PickerItem } from "@/components/ItemPickerSheet";
import { COUNTRIES, getCountryByCode } from "@/constants/user-data";

type TravelInterestsFormData = ProfileCreationData | EditProfileData;

interface TravelInterestsProps {
  control: Control<TravelInterestsFormData>;
  errors: FieldErrors<TravelInterestsFormData>;
}

export const TravelInterests: React.FC<TravelInterestsProps> = ({
  control,
  errors,
}) => {
  const theme = useTheme();
  const countriesTraveledSheetRef = useRef<BottomSheetModal>(null);
  const countriesWantToTravelSheetRef = useRef<BottomSheetModal>(null);

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
    buttonText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    buttonPlaceholder: {
      color: theme.colors.textMuted,
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
    flag: {
      fontSize: moderateScale(12),
      marginRight: scale(4),
    },
    removeButton: {
      marginLeft: scale(4),
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: verticalScale(40),
    },
    emptyIcon: {
      marginBottom: verticalScale(16),
    },
    emptyTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      textAlign: "center",
    },
    emptyDescription: {
      fontSize: moderateScale(13),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: moderateScale(14),
    },
  });

  const renderSelectedCountries = (
    countryCodes: string[],
    onRemove: (code: string) => void
  ) => {
    if (!countryCodes || countryCodes.length === 0) return null;

    return (
      <View style={styles.selectedItemsContainer}>
        {countryCodes.map((code) => {
          const country = getCountryByCode(code);
          if (!country) return null;

          return (
            <View key={code} style={styles.selectedItem}>
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.selectedItemText}>{country.name}</Text>
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
      {/* Header Section */}
      <View style={styles.section}>
        <View style={styles.emptyState}>
          <Ionicons
            name="airplane"
            size={scale(48)}
            color={theme.colors.primary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Travel Interests</Text>
          <Text style={styles.emptyDescription}>
            Share your travel experiences and dream destinations to connect with
            fellow travelers and discover new places together.
          </Text>
        </View>
      </View>

      {/* Countries Traveled */}
      <View style={styles.section}>
        <Text style={styles.label}>Countries I've Traveled To</Text>
        <Text style={styles.description}>
          Select the countries you've visited. This helps others learn about
          your travel experiences.
        </Text>
        <Controller
          control={control}
          name="countriesTraveled"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  errors.countriesTraveled && styles.buttonError,
                ]}
                onPress={() => countriesTraveledSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (!value || value.length === 0) && styles.buttonPlaceholder,
                  ]}
                >
                  {value && value.length > 0
                    ? `${value.length} countr${
                        value.length > 1 ? "ies" : "y"
                      } selected`
                    : "Select countries you've visited"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {value &&
                value.length > 0 &&
                renderSelectedCountries(value, (code) => {
                  const newValue = value.filter((country) => country !== code);
                  onChange(newValue);
                })}
              <ItemPickerSheet
                ref={countriesTraveledSheetRef}
                title="Countries Traveled"
                items={countryItems}
                selectedItems={value || []}
                onSelectionChange={onChange}
                multiSelect={true}
                searchable={true}
                placeholder="Search countries..."
              />
            </>
          )}
        />
        {errors.countriesTraveled && (
          <Text style={styles.errorText}>
            {errors.countriesTraveled.message}
          </Text>
        )}
      </View>

      {/* Countries Want to Travel */}
      <View style={styles.section}>
        <Text style={styles.label}>Countries I Want to Travel To</Text>
        <Text style={styles.description}>
          Select your dream destinations. Connect with others who share similar
          travel goals or have been to these places.
        </Text>
        <Controller
          control={control}
          name="countriesWantToTravel"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  errors.countriesWantToTravel && styles.buttonError,
                ]}
                onPress={() => countriesWantToTravelSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (!value || value.length === 0) && styles.buttonPlaceholder,
                  ]}
                >
                  {value && value.length > 0
                    ? `${value.length} countr${
                        value.length > 1 ? "ies" : "y"
                      } selected`
                    : "Select countries you want to visit"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {value &&
                value.length > 0 &&
                renderSelectedCountries(value, (code) => {
                  const newValue = value.filter((country) => country !== code);
                  onChange(newValue);
                })}
              <ItemPickerSheet
                ref={countriesWantToTravelSheetRef}
                title="Want to Travel"
                items={countryItems}
                selectedItems={value || []}
                onSelectionChange={onChange}
                multiSelect={true}
                searchable={true}
                placeholder="Search countries..."
              />
            </>
          )}
        />
        {errors.countriesWantToTravel && (
          <Text style={styles.errorText}>
            {errors.countriesWantToTravel.message}
          </Text>
        )}
      </View>
    </View>
  );
};
