import React, { forwardRef, useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/stores/theme.store";

export interface PickerItem {
  id: string;
  name: string;
  flag?: string; // For countries
  code?: string; // For languages/countries
  emoji?: string; // For hobbies
}

interface ItemPickerSheetProps {
  title: string;
  items: PickerItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  searchable?: boolean;
  placeholder?: string;
}

export const ItemPickerSheet = forwardRef<
  BottomSheetModal,
  ItemPickerSheetProps
>(
  (
    {
      title,
      items,
      selectedItems,
      onSelectionChange,
      multiSelect = false,
      searchable = true,
      placeholder = "Search...",
    },
    ref
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["80%", "100%"], []);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = useMemo(() => {
      if (!searchQuery.trim()) return items;
      return items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [items, searchQuery]);

    const handleItemPress = useCallback(
      (itemId: string) => {
        if (multiSelect) {
          const newSelection = selectedItems.includes(itemId)
            ? selectedItems.filter((id) => id !== itemId)
            : [...selectedItems, itemId];
          onSelectionChange(newSelection);
        } else {
          onSelectionChange([itemId]);
          (ref as any)?.current?.dismiss();
        }
      },
      [selectedItems, onSelectionChange, multiSelect, ref]
    );

    const handleDone = useCallback(() => {
      (ref as any)?.current?.dismiss();
    }, [ref]);

    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.colors.surface,
        flex: 1,
      },
      headerContainer: {
        paddingHorizontal: scale(20),
        backgroundColor: theme.colors.surface,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: verticalScale(16),
      },
      headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: "700",
        color: theme.colors.text,
        flex: 1,
        textAlign: multiSelect ? "left" : "center",
      },
      doneButton: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(theme.borderRadius.md),
        backgroundColor: theme.colors.primary,
      },
      doneButtonText: {
        fontSize: moderateScale(14),
        fontWeight: "600",
        color: theme.colors.white,
      },
      searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: scale(theme.borderRadius.md),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      searchIcon: {
        marginRight: scale(12),
      },
      searchInput: {
        flex: 1,
        fontSize: moderateScale(14),
        color: theme.colors.text,
      },
      listContainer: {
        paddingHorizontal: scale(20),
      },
      item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        borderRadius: scale(theme.borderRadius.md),
        marginVertical: verticalScale(2),
        backgroundColor: theme.colors.background,
      },
      itemSelected: {
        backgroundColor: theme.colors.success + "15",
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      itemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      },
      itemFlag: {
        fontSize: moderateScale(14),
        marginRight: scale(12),
      },
      itemText: {
        fontSize: moderateScale(14),
        color: theme.colors.text,
        fontWeight: "500",
      },
      itemTextSelected: {
        color: theme.colors.success,
        fontWeight: "600",
      },
      checkIcon: {
        marginLeft: scale(12),
      },
      emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: verticalScale(40),
        paddingHorizontal: scale(20),
      },
      emptyText: {
        fontSize: moderateScale(14),
        color: theme.colors.textMuted,
        textAlign: "center",
      },
    });

    const renderItem = useCallback(
      ({ item }: { item: PickerItem }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
          <TouchableOpacity
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => handleItemPress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              {item.flag && <Text style={styles.itemFlag}>{item.flag}</Text>}
              {item.emoji && <Text style={styles.itemFlag}>{item.emoji}</Text>}
              <Text
                style={[styles.itemText, isSelected && styles.itemTextSelected]}
              >
                {item.name}
              </Text>
            </View>
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={scale(20)}
                color={theme.colors.success}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        );
      },
      [selectedItems, handleItemPress, styles, theme.colors.primary]
    );

    const renderEmpty = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "No items found" : "No items available"}
          </Text>
        </View>
      ),
      [searchQuery, styles]
    );

    const keyExtractor = useCallback((item: PickerItem) => item.id, []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        bottomInset={insets.bottom}
        enableDynamicSizing={false}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              {!multiSelect && <View style={{ width: scale(60) }} />}
              <Text style={styles.headerTitle}>{title}</Text>
              {multiSelect && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
              {!multiSelect && <View style={{ width: scale(60) }} />}
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                  style={styles.searchIcon}
                />
                <BottomSheetTextInput
                  style={styles.searchInput}
                  placeholder={placeholder}
                  placeholderTextColor={theme.colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
          </View>

          <BottomSheetFlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            // estimatedItemSize={verticalScale(60)} // Estimated height of each item
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: verticalScale(20) },
            ]}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

ItemPickerSheet.displayName = "ItemPickerSheet";
