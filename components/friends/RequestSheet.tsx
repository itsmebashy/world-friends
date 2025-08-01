import type React from "react";
import { memo, useCallback, useState, forwardRef, useMemo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { getCountryByCode } from "@/constants/user-data";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Request } from "@/data/requests";

interface RequestSheetProps {
  request: Request | null;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onClose: () => void;
}

const RequestSheetComponent = forwardRef<BottomSheetModal, RequestSheetProps>(
  ({ request, onAccept, onDecline, onClose }, ref) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [imageLoadError, setImageLoadError] = useState(false);
    const snapPoints = useMemo(() => ["72%"], []);

    const country = request ? getCountryByCode(request.countryCode) : null;

    const handleImageError = useCallback(() => {
      setImageLoadError(true);
    }, []);

    const handleAccept = useCallback(() => {
      if (request) {
        onAccept(request.id);
        (ref as any)?.current?.dismiss();
        onClose();
      }
    }, [request, onAccept, onClose, ref]);

    const handleDecline = useCallback(() => {
      if (request) {
        onDecline(request.id);
        (ref as any)?.current?.dismiss();
        onClose();
      }
    }, [request, onDecline, onClose, ref]);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(20),
      },
      header: {
        alignItems: "center",
        marginBottom: verticalScale(20),
        paddingTop: verticalScale(20),
      },
      profileImageContainer: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(theme.borderRadius.full),
        borderWidth: scale(3),
        borderColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(16),
        overflow: "hidden",
      },
      profileImage: {
        width: "100%",
        height: "100%",
      },
      profileImageError: {
        backgroundColor: theme.colors.border,
        justifyContent: "center",
        alignItems: "center",
      },
      name: {
        fontSize: moderateScale(14),
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: verticalScale(12),
        textAlign: "center",
      },
      infoRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(12),
      },
      genderButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.error, // Red for female
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(theme.borderRadius.full),
        marginRight: scale(8),
      },
      genderButtonMale: {
        backgroundColor: theme.colors.info, // Blue for male
      },
      genderButtonOther: {
        backgroundColor: theme.colors.warning, // Orange for other
      },
      ageButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.info,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(theme.borderRadius.full),
      },
      ageText: {
        fontSize: moderateScale(14),
        color: theme.colors.white,
        fontWeight: "600",
        marginLeft: scale(4),
      },
      countryContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: verticalScale(20),
      },
      flagEmoji: {
        fontSize: moderateScale(14),
        marginRight: scale(8),
      },
      countryText: {
        fontSize: moderateScale(16),
        color: theme.colors.text,
        fontWeight: "600",
      },
      messageContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: scale(theme.borderRadius.md),
        padding: scale(16),
        marginBottom: verticalScale(24),
      },
      messageLabel: {
        fontSize: moderateScale(14),
        color: theme.colors.textSecondary,
        fontWeight: "600",
        marginBottom: verticalScale(8),
      },
      messageText: {
        fontSize: moderateScale(16),
        color: theme.colors.text,
        lineHeight: moderateScale(14),
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
        paddingVertical: verticalScale(14),
        borderRadius: scale(theme.borderRadius.full),
      },
      acceptButton: {
        backgroundColor: theme.colors.success,
      },
      declineButton: {
        backgroundColor: theme.colors.error,
      },
      buttonText: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: theme.colors.white,
        marginLeft: scale(8),
      },
    });

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        bottomInset={insets.bottom}
        enableDynamicSizing={false}
      >
        {request && (
          <BottomSheetView style={styles.container}>
            <View style={styles.header}>
              <View style={styles.profileImageContainer}>
                {imageLoadError ? (
                  <View style={styles.profileImageError}>
                    <Ionicons
                      name="person"
                      size={scale(60)}
                      color={theme.colors.textMuted}
                    />
                  </View>
                ) : (
                  <Image
                    source={{ uri: request.profilePhoto }}
                    style={styles.profileImage}
                    onError={handleImageError}
                  />
                )}
              </View>

              <Text style={styles.name}>{request.name}</Text>

              <View style={styles.infoRow}>
                <View
                  style={[
                    styles.genderButton,
                    request.gender === "male" && styles.genderButtonMale,
                    request.gender === "other" && styles.genderButtonOther,
                  ]}
                >
                  <Text style={{ fontSize: moderateScale(16) }}>
                    {request.gender === "female"
                      ? "👩"
                      : request.gender === "male"
                        ? "👨"
                        : "👤"}
                  </Text>
                </View>
                <View style={styles.ageButton}>
                  <Text style={styles.ageText}>🎂</Text>
                  <Text style={styles.ageText}>{request.age}</Text>
                </View>
              </View>

              <View style={styles.countryContainer}>
                {country && (
                  <Text style={styles.flagEmoji}>{country.flag}</Text>
                )}
                <Text style={styles.countryText}>
                  {country?.name || "Unknown"}
                </Text>
              </View>
            </View>

            <View style={styles.messageContainer}>
              <Text style={styles.messageLabel}>Message:</Text>
              <Text style={styles.messageText}>{request.requestMessage}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={handleDecline}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close"
                  size={scale(20)}
                  color={theme.colors.white}
                />
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={handleAccept}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark"
                  size={scale(20)}
                  color={theme.colors.white}
                />
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  }
);

RequestSheetComponent.displayName = "RequestSheet";

export const RequestSheet = memo(RequestSheetComponent);
