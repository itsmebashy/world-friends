import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  visible: boolean;
  icon?: string;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  icon,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: scale(32),
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      paddingVertical: verticalScale(24),
      paddingHorizontal: scale(24),
      width: "100%",
      maxWidth: scale(320),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    iconContainer: {
      alignItems: "center",
      marginBottom: verticalScale(16),
    },
    title: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: verticalScale(8),
    },
    description: {
      fontSize: moderateScale(15),
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(24),
    },
    buttonContainer: {
      flexDirection: "row",
      gap: scale(12),
    },
    button: {
      flex: 1,
      paddingVertical: verticalScale(12),
      borderRadius: scale(theme.borderRadius.md),
      alignItems: "center",
    },
    confirmButton: {
      backgroundColor: theme.colors.error,
    },
    cancelButton: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    confirmButtonText: {
      color: "#FFFFFF",
      fontSize: moderateScale(16),
      fontWeight: "600",
    },
    cancelButtonText: {
      color: theme.colors.text,
      fontSize: moderateScale(16),
      fontWeight: "600",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
        >
          {icon && (
            <View style={styles.iconContainer}>
              <Ionicons
                name={icon as any}
                size={scale(48)}
                color={theme.colors.error}
              />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
