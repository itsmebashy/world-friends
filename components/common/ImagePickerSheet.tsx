import React, { forwardRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/stores/theme.store";

interface ImagePickerSheetProps {
  onImageSelected: (imageUri: string) => void;
}

export const ImagePickerSheet = forwardRef<
  BottomSheetModal,
  ImagePickerSheetProps
>(({ onImageSelected }, ref) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["38%"], []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: scale(20),
      // paddingBottom: insets.bottom + verticalScale(20),
    },
    header: {
      alignItems: "center",
      paddingVertical: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: verticalScale(16),
    },
    headerTitle: {
      fontSize: moderateScale(18),
      fontWeight: "700",
      color: theme.colors.text,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      borderRadius: scale(theme.borderRadius.md),
      marginVertical: verticalScale(4),
      backgroundColor: theme.colors.background,
    },
    optionIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: scale(16),
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    optionDescription: {
      fontSize: moderateScale(13),
      color: theme.colors.textSecondary,
    },
  });

  const handleCameraPress = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
        (ref as any)?.current?.dismiss();
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const handleGalleryPress = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Photo library permission is required to select photos.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
        (ref as any)?.current?.dismiss();
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to open photo library");
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      bottomInset={insets.bottom}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Photo</Text>
        </View>

        <TouchableOpacity
          style={styles.option}
          onPress={handleCameraPress}
          activeOpacity={0.7}
        >
          <View style={styles.optionIcon}>
            <Ionicons
              name="camera"
              size={scale(20)}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Take Photo</Text>
            <Text style={styles.optionDescription}>
              Use your camera to take a new photo
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={handleGalleryPress}
          activeOpacity={0.7}
        >
          <View style={styles.optionIcon}>
            <Ionicons
              name="images"
              size={scale(20)}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Choose from Gallery</Text>
            <Text style={styles.optionDescription}>
              Select a photo from your gallery
            </Text>
          </View>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ImagePickerSheet.displayName = "ImagePickerSheet";
