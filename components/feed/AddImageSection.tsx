import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";

interface AddImageSectionProps {
  image: string | null;
  onAddImage: () => void;
  onRemoveImage: () => void;
}

export const AddImageSection: React.FC<AddImageSectionProps> = ({
  image,
  onAddImage,
  onRemoveImage,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(16),
      marginTop: verticalScale(16),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(12),
    },
    headerIcon: {
      marginRight: scale(8),
    },
    headerText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary + "15",
      borderRadius: scale(theme.borderRadius.md),
      paddingVertical: verticalScale(12),
      borderWidth: 2,
      borderColor: theme.colors.primary + "30",
      borderStyle: "dashed",
    },
    addButtonText: {
      fontSize: moderateScale(14),
      fontWeight: "500",
      color: theme.colors.primary,
      marginLeft: scale(8),
    },
    imagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: verticalScale(12),
    },
    imageContainer: {
      position: "relative",
      width: scale(80),
      height: scale(80),
      borderRadius: scale(theme.borderRadius.md),
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    removeButton: {
      position: "absolute",
      top: scale(4),
      right: scale(4),
      width: scale(24),
      height: scale(24),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.error,
      alignItems: "center",
      justifyContent: "center",
    },
    imageLimit: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      textAlign: "center",
      marginTop: verticalScale(8),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="images"
          size={scale(20)}
          color={theme.colors.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Add Photos</Text>
      </View>

      {image && (
        <View style={styles.imagesContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={onRemoveImage}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={scale(16)}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!image && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddImage}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={scale(20)} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add Photo</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.imageLimit}>You can add 1 photo</Text>
    </View>
  );
};
