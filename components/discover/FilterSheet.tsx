import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/stores/theme.store";
import {
  useFilterStore,
  useSelectedCountry,
  useSelectedLanguageSpoken,
  useSelectedLanguageLearning,
  useFilterActions,
} from "@/stores/filter.store";
import {
  COUNTRIES,
  LANGUAGES,
  getCountryByCode,
  getLanguageByCode,
} from "@/constants/user-data";

interface FilterItem {
  id: string;
  name: string;
  flag?: string;
  code: string;
}

export const FilterSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["84%", "100%"], []);

  const selectedCountry = useSelectedCountry();
  const selectedLanguageSpoken = useSelectedLanguageSpoken();
  const selectedLanguageLearning = useSelectedLanguageLearning();
  const {
    setSelectedCountry,
    setSelectedLanguageSpoken,
    setSelectedLanguageLearning,
    resetFilters,
    getSelectedFilters,
  } = useFilterActions();

  const countryItems: FilterItem[] = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        id: country.code,
        name: country.name,
        flag: country.flag,
        code: country.code,
      })),
    []
  );

  const languageItems: FilterItem[] = useMemo(
    () =>
      LANGUAGES.map((language) => ({
        id: language.code,
        name: language.name,
        code: language.code,
      })),
    []
  );

  const hasActiveFilters = useMemo(() => {
    return !!(
      selectedCountry ||
      selectedLanguageSpoken ||
      selectedLanguageLearning
    );
  }, [selectedCountry, selectedLanguageSpoken, selectedLanguageLearning]);

  const selectedFilters = useMemo(() => {
    const filters = [];
    if (selectedCountry) {
      const country = getCountryByCode(selectedCountry);
      if (country)
        filters.push({
          type: "Country",
          name: country.name,
          flag: country.flag,
        });
    }
    if (selectedLanguageSpoken) {
      const language = getLanguageByCode(selectedLanguageSpoken);
      if (language)
        filters.push({ type: "Language Spoken", name: language.name });
    }
    if (selectedLanguageLearning) {
      const language = getLanguageByCode(selectedLanguageLearning);
      if (language)
        filters.push({ type: "Language Learning", name: language.name });
    }
    return filters;
  }, [selectedCountry, selectedLanguageSpoken, selectedLanguageLearning]);

  const handleCountrySelect = useCallback(
    (countryCode: string) => {
      setSelectedCountry(selectedCountry === countryCode ? null : countryCode);
    },
    [selectedCountry, setSelectedCountry]
  );

  const handleLanguageSpokenSelect = useCallback(
    (languageCode: string) => {
      setSelectedLanguageSpoken(
        selectedLanguageSpoken === languageCode ? null : languageCode
      );
    },
    [selectedLanguageSpoken, setSelectedLanguageSpoken]
  );

  const handleLanguageLearningSelect = useCallback(
    (languageCode: string) => {
      setSelectedLanguageLearning(
        selectedLanguageLearning === languageCode ? null : languageCode
      );
    },
    [selectedLanguageLearning, setSelectedLanguageLearning]
  );

  const handleApply = useCallback(() => {
    // Close the sheet - the filters are already applied via the store
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
  }, [ref]);

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderCountryItem = useCallback(
    ({ item }: { item: FilterItem }) => {
      const isSelected = selectedCountry === item.code;
      return (
        <TouchableOpacity
          style={[
            styles.filterItem,
            isSelected && { backgroundColor: theme.colors.success },
          ]}
          onPress={() => handleCountrySelect(item.code)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterItemFlag}>{item.flag}</Text>
          <Text
            style={[
              styles.filterItemText,
              isSelected && { color: theme.colors.white },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [
      selectedCountry,
      theme.colors.success,
      theme.colors.white,
      handleCountrySelect,
    ]
  );

  const renderLanguageItem = useCallback(
    ({ item, isSpoken }: { item: FilterItem; isSpoken: boolean }) => {
      const isSelected = isSpoken
        ? selectedLanguageSpoken === item.code
        : selectedLanguageLearning === item.code;
      const onPress = isSpoken
        ? handleLanguageSpokenSelect
        : handleLanguageLearningSelect;

      return (
        <TouchableOpacity
          style={[
            styles.filterItem,
            isSelected && { backgroundColor: theme.colors.success },
          ]}
          onPress={() => onPress(item.code)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterItemText,
              isSelected && { color: theme.colors.white },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [
      selectedLanguageSpoken,
      selectedLanguageLearning,
      theme.colors.success,
      theme.colors.white,
      handleLanguageSpokenSelect,
      handleLanguageLearningSelect,
    ]
  );

  const renderSelectedFilterItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.selectedFilterChip}>
        {item.flag && (
          <Text style={styles.selectedFilterFlag}>{item.flag}</Text>
        )}
        <Text style={styles.selectedFilterText}>
          {item.flag ? item.name : `${item.type}: ${item.name}`}
        </Text>
      </View>
    ),
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: moderateScale(20),
      fontWeight: "700",
      color: theme.colors.text,
    },
    closeButton: {
      padding: scale(4),
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(20),
    },
    section: {
      marginVertical: verticalScale(16),
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    filterItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      marginRight: scale(12),
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterItemFlag: {
      fontSize: moderateScale(16),
      marginRight: scale(8),
    },
    filterItemText: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      fontWeight: "500",
    },
    selectedFiltersSection: {
      marginTop: verticalScale(8),
    },
    selectedFilterChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.success + "15",
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(6),
      marginRight: scale(8),
      marginBottom: verticalScale(6),
      borderRadius: scale(theme.borderRadius.full),
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
    selectedFilterFlag: {
      fontSize: moderateScale(12),
      marginRight: scale(6),
    },
    selectedFilterText: {
      fontSize: moderateScale(12),
      color: theme.colors.success,
      fontWeight: "600",
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
      paddingBottom: insets.bottom + verticalScale(20),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: scale(12),
    },
    resetButton: {
      flex: 1,
      paddingVertical: verticalScale(14),
      borderRadius: scale(theme.borderRadius.lg),
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    resetButtonDisabled: {
      opacity: 0.5,
    },
    resetButtonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
    },
    applyButton: {
      flex: 1,
      paddingVertical: verticalScale(14),
      borderRadius: scale(theme.borderRadius.lg),
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    applyButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    applyButtonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.white,
    },
  });

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      bottomInset={insets.bottom}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => ref && "current" in ref && ref.current?.dismiss()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={scale(24)} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Country Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Country</Text>
            <FlatList
              data={countryItems}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: scale(20) }}
            />
          </View>

          {/* Language Spoken Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language Spoken</Text>
            <FlatList
              data={languageItems}
              renderItem={({ item }) =>
                renderLanguageItem({ item, isSpoken: true })
              }
              keyExtractor={(item) => `spoken-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: scale(20) }}
            />
          </View>

          {/* Language Learning Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Language Learning</Text>
            <FlatList
              data={languageItems}
              renderItem={({ item }) =>
                renderLanguageItem({ item, isSpoken: false })
              }
              keyExtractor={(item) => `learning-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: scale(20) }}
            />
          </View>

          {/* Selected Filters Section */}
          {selectedFilters.length > 0 && (
            <View style={[styles.section, styles.selectedFiltersSection]}>
              <Text style={styles.sectionTitle}>Selected Filters</Text>
              <FlatList
                data={selectedFilters}
                renderItem={renderSelectedFilterItem}
                keyExtractor={(item, index) => `selected-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: scale(20) }}
              />
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.resetButton,
              !hasActiveFilters && styles.resetButtonDisabled,
            ]}
            onPress={handleReset}
            disabled={!hasActiveFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.applyButton,
              !hasActiveFilters && styles.applyButtonDisabled,
            ]}
            onPress={handleApply}
            disabled={!hasActiveFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterSheet.displayName = "FilterSheet";
