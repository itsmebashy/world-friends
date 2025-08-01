import React from "react";
import { View, Text, Modal, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";

const { width: screenWidth } = Dimensions.get("window");

interface LoadingModalProps {
  visible: boolean;
  isCreating?: boolean; // true for creating, false for updating
  loadingAnimation: any; // Animation source
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  isCreating = true,
  loadingAnimation,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.xl),
      padding: scale(32),
      alignItems: "center",
      justifyContent: "center",
      width: screenWidth * 0.8,
      maxWidth: scale(320),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
    animationContainer: {
      width: scale(120),
      height: scale(120),
      marginBottom: verticalScale(24),
    },
    animation: {
      width: "100%",
      height: "100%",
    },
    title: {
      fontSize: moderateScale(20),
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: verticalScale(8),
    },
    subtitle: {
      fontSize: moderateScale(16),
      color: theme.colors.textMuted,
      textAlign: "center",
      lineHeight: moderateScale(22),
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.animationContainer}>
            <LottieView
              source={loadingAnimation}
              style={styles.animation}
              autoPlay
              loop
              speed={1}
            />
          </View>

          <Text style={styles.title}>
            {isCreating ? "Creating Profile" : "Updating Profile"}
          </Text>

          <Text style={styles.subtitle}>
            {isCreating
              ? "Please wait while we set up your profile..."
              : "Please wait while we save your changes..."}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
