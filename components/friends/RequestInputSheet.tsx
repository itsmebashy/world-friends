import React, { forwardRef, useCallback, useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/stores/theme.store";
import Toast from "react-native-toast-message";

interface RequestInputSheetProps {
  userName?: string;
  onSendRequest: (message: string) => void;
  onClose?: () => void;
}

export const RequestInputSheet = forwardRef<
  BottomSheetModal,
  RequestInputSheetProps
>(({ userName, onSendRequest, onClose }, ref) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  const snapPoints = useMemo(() => ["75%"], []);

  const handleSendRequest = useCallback(() => {
    if (!message.trim()) {
      Toast.show({
        type: "error",
        text1: "Message Required",
        text2: "Please enter a message before sending",
        position: "top",
      });
      return;
    }

    onSendRequest(message.trim());
    setMessage("");
    (ref as any)?.current?.dismiss();
    onClose?.();
  }, [message, onSendRequest, onClose, ref]);

  const handleClose = useCallback(() => {
    setMessage("");
    (ref as any)?.current?.dismiss();
    onClose?.();
  }, [onClose, ref]);

  const isMessageValid = message.trim().length > 0;
  const characterCount = message.length;
  const maxCharacters = 300;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingBottom: Math.max(insets.bottom, verticalScale(20)),
    },
    header: {
      alignItems: "center",
      paddingVertical: verticalScale(20),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: verticalScale(24),
    },
    headerTitle: {
      fontSize: moderateScale(20),
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: verticalScale(8),
    },
    headerSubtitle: {
      fontSize: moderateScale(14),
      color: theme.colors.textMuted,
      textAlign: "center",
    },
    inputContainer: {
      flex: 1,
      marginBottom: verticalScale(20),
    },
    inputLabel: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(12),
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: scale(theme.borderRadius.lg),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      fontSize: moderateScale(14),
      color: theme.colors.text,
      textAlignVertical: "top",
      minHeight: verticalScale(120),
      maxHeight: verticalScale(200),
    },
    textInputFocused: {
      borderColor: theme.colors.primary,
    },
    characterCounter: {
      alignSelf: "flex-end",
      marginTop: verticalScale(8),
    },
    characterCountText: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
    },
    characterCountTextLimit: {
      color: theme.colors.error,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: scale(12),
    },
    button: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: verticalScale(16),
      borderRadius: scale(theme.borderRadius.lg),
      gap: scale(8),
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    buttonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    sendButtonText: {
      color: theme.colors.white,
    },
    sendButtonTextDisabled: {
      color: theme.colors.textMuted,
    },
  });

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      bottomInset={insets.bottom}
      enableDynamicSizing={false}
      keyboardBehavior="fillParent"
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Send Friend Request</Text>
          {userName && (
            <Text style={styles.headerSubtitle}>
              Send a friend request to {userName}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Message</Text>
          <BottomSheetTextInput
            style={styles.textInput}
            placeholder="Write a message to introduce yourself..."
            placeholderTextColor={theme.colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline={true}
            maxLength={maxCharacters}
            textAlignVertical="top"
          />
          <View style={styles.characterCounter}>
            <Text
              style={[
                styles.characterCountText,
                characterCount > maxCharacters * 0.9 &&
                  styles.characterCountTextLimit,
              ]}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={scale(20)} color={theme.colors.text} />
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isMessageValid ? styles.sendButton : styles.sendButtonDisabled,
            ]}
            onPress={handleSendRequest}
            activeOpacity={0.7}
            disabled={!isMessageValid}
          >
            <Ionicons
              name="paper-plane"
              size={scale(20)}
              color={
                isMessageValid ? theme.colors.white : theme.colors.textMuted
              }
            />
            <Text
              style={[
                styles.buttonText,
                isMessageValid
                  ? styles.sendButtonText
                  : styles.sendButtonTextDisabled,
              ]}
            >
              Send Request
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

RequestInputSheet.displayName = "RequestInputSheet";
