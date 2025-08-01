import React, { useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { ProfileCreationData, EditProfileData } from "@/validations/profile";
import { ItemPickerSheet, PickerItem } from "@/components/ItemPickerSheet";
import { HOBBIES, getHobbyById } from "@/constants/user-data";

type AboutMeFormData = ProfileCreationData | EditProfileData;

interface AboutMeProps {
  control: Control<AboutMeFormData>;
  errors: FieldErrors<AboutMeFormData>;
}

export const AboutMe: React.FC<AboutMeProps> = ({ control, errors }) => {
  const theme = useTheme();
  const hobbiesSheetRef = useRef<BottomSheetModal>(null);
  const [bookInput, setBookInput] = useState("");

  const hobbyItems: PickerItem[] = useMemo(
    () =>
      HOBBIES.map((hobby) => ({
        id: hobby.id,
        name: hobby.name,
        emoji: hobby.emoji,
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
    textArea: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      fontSize: moderateScale(14),
      color: theme.colors.text,
      minHeight: verticalScale(120),
      textAlignVertical: "top",
    },
    textAreaError: {
      borderColor: theme.colors.error,
    },
    counterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: verticalScale(4),
    },
    counter: {
      fontSize: moderateScale(12),
      fontWeight: "500",
    },
    counterDefault: {
      color: theme.colors.textMuted,
    },
    counterRed: {
      color: theme.colors.error,
    },
    counterGreen: {
      color: theme.colors.success,
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.colors.error,
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
    bookInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: scale(8),
    },
    bookInput: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      fontSize: moderateScale(14),
      color: theme.colors.text,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: scale(theme.borderRadius.md),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      alignItems: "center",
      justifyContent: "center",
    },
    addButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    addButtonText: {
      fontSize: moderateScale(13),
      fontWeight: "600",
      color: theme.colors.white,
    },
    addButtonTextDisabled: {
      color: theme.colors.textMuted,
    },
  });

  const getCounterColor = (length: number) => {
    if (length < 100) return styles.counterRed;
    if (length >= 100) return styles.counterGreen;
    return styles.counterDefault;
  };

  const renderSelectedHobbies = (
    hobbyIds: string[],
    onRemove: (id: string) => void
  ) => {
    if (hobbyIds.length === 0) return null;

    return (
      <View style={styles.selectedItemsContainer}>
        {hobbyIds.map((id) => {
          const hobby = getHobbyById(id);
          if (!hobby) return null;

          return (
            <View key={id} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>
                {hobby.emoji} {hobby.name}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(id)}
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

  const renderSelectedBooks = (
    books: string[],
    onRemove: (index: number) => void
  ) => {
    if (books.length === 0) return null;

    return (
      <View style={styles.selectedItemsContainer}>
        {books.map((book, index) => (
          <View key={index} style={styles.selectedItem}>
            <Text style={styles.selectedItemText}>{book}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={scale(14)}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.label}>About Me *</Text>
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={[styles.textArea, errors.bio && styles.textAreaError]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.textMuted}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                maxLength={1000}
              />
              <View style={styles.counterContainer}>
                <View />
                <Text
                  style={[styles.counter, getCounterColor(value?.length || 0)]}
                >
                  {value?.length || 0}/1000
                </Text>
              </View>
            </>
          )}
        />
      </View>

      {/* Hobbies Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Hobbies *</Text>
        <Controller
          control={control}
          name="hobbies"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                style={[styles.button, errors.hobbies && styles.buttonError]}
                onPress={() => hobbiesSheetRef.current?.present()}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    (!value || value.length === 0) && styles.buttonPlaceholder,
                  ]}
                >
                  {value && value.length > 0
                    ? `${value.length} hobbies selected`
                    : "Select your hobbies"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={scale(20)}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
              {value &&
                value.length > 0 &&
                renderSelectedHobbies(value, (id) => {
                  const newValue = value.filter((hobby) => hobby !== id);
                  onChange(newValue);
                })}
              <ItemPickerSheet
                ref={hobbiesSheetRef}
                title="Select Hobbies"
                items={hobbyItems}
                selectedItems={value || []}
                onSelectionChange={onChange}
                multiSelect={true}
                searchable={true}
                placeholder="Search hobbies..."
              />
            </>
          )}
        />
        {errors.hobbies && (
          <Text style={styles.errorText}>{errors.hobbies.message}</Text>
        )}
      </View>

      {/* Favorite Books Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Favorite Books (Optional)</Text>
        <Controller
          control={control}
          name="favoriteBooks"
          render={({ field: { onChange, value } }) => (
            <>
              <View style={styles.bookInputContainer}>
                <TextInput
                  style={styles.bookInput}
                  placeholder="Enter a book title"
                  placeholderTextColor={theme.colors.textMuted}
                  value={bookInput}
                  onChangeText={setBookInput}
                />
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !bookInput.trim() && styles.addButtonDisabled,
                  ]}
                  onPress={() => {
                    if (bookInput.trim()) {
                      const newBooks = [...(value || []), bookInput.trim()];
                      onChange(newBooks);
                      setBookInput("");
                    }
                  }}
                  disabled={!bookInput.trim()}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.addButtonText,
                      !bookInput.trim() && styles.addButtonTextDisabled,
                    ]}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
              {value &&
                value.length > 0 &&
                renderSelectedBooks(value, (index) => {
                  const newBooks = value.filter((_, i) => i !== index);
                  onChange(newBooks);
                })}
            </>
          )}
        />
      </View>
    </View>
  );
};
