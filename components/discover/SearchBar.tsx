import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/stores/theme.store";
import { useHasActiveFilters } from "@/stores/filter.store";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  initialPlaceholder?: string;
}

const PLACEHOLDERS = ["Search by name...", "Search by username..."];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterPress,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hasActiveFilters = useHasActiveFilters();
  const [searchText, setSearchText] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    // Set a random placeholder on component mount
    const randomIndex = Math.floor(Math.random() * PLACEHOLDERS.length);
    setCurrentPlaceholder(PLACEHOLDERS[randomIndex]);
  }, []);

  const handleSearchPress = useCallback(() => {
    if (isSearchActive) {
      // If search is active, clear it
      setSearchText("");
      setIsSearchActive(false);
      onSearch("");
    } else if (searchText.trim().length >= 3) {
      // If search is not active and text is valid, trigger search
      setIsSearchActive(true);
      onSearch(searchText.trim());
    }
  }, [searchText, onSearch, isSearchActive]);

  const isSearchEnabled = searchText.trim().length >= 3 || isSearchActive;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(12),
      paddingHorizontal: scale(16),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      position: "absolute",
      top: insets.top + verticalScale(70), // Position below the TabHeader with safe area
      left: 0,
      right: 0,
      zIndex: 999,
    },
    textInput: {
      flex: 1,
      fontSize: moderateScale(16),
      color: theme.colors.text,
      paddingVertical: verticalScale(12),
      paddingRight: scale(10),
    },
    searchButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.primary,
      marginLeft: scale(8),
    },
    searchButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },
    filterButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginLeft: scale(8),
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={currentPlaceholder}
        placeholderTextColor={theme.colors.textMuted}
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        onSubmitEditing={handleSearchPress}
        selectionColor={theme.colors.primary}
      />
      <TouchableOpacity
        style={[
          styles.searchButton,
          !isSearchEnabled && styles.searchButtonDisabled,
        ]}
        onPress={handleSearchPress}
        disabled={!isSearchEnabled}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSearchActive ? "close" : "search"}
          size={scale(20)}
          color={theme.colors.white}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          hasActiveFilters && styles.filterButtonActive,
        ]}
        onPress={onFilterPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="options-outline"
          size={scale(20)}
          color={hasActiveFilters ? theme.colors.primary : theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};
