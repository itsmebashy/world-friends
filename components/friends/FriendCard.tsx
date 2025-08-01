import type React from "react";
import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { getCountryByCode } from "@/constants/user-data";
import type { Friend } from "@/data/friends";

interface FriendCardProps {
  friend: Friend;
  onMessage: (friendId: string) => void;
}

const FriendCardComponent: React.FC<FriendCardProps> = ({
  friend,
  onMessage,
}) => {
  const theme = useTheme();
  const [imageLoadError, setImageLoadError] = useState(false);

  const country = getCountryByCode(friend.countryCode);

  const handleImageError = useCallback(() => {
    setImageLoadError(true);
  }, []);

  const handleMessage = useCallback(() => {
    onMessage(friend.id);
  }, [friend.id, onMessage]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      padding: scale(20),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(8),
      alignItems: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
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
      fontSize: moderateScale(24),
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
      width: "100%",
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
    messageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: verticalScale(14),
      borderRadius: scale(theme.borderRadius.full),
      width: "100%",
    },
    messageButtonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.white,
      marginLeft: scale(8),
    },
  });

  return (
    <View style={styles.card}>
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
            source={{ uri: friend.profilePhoto }}
            style={styles.profileImage}
            onError={handleImageError}
          />
        )}
      </View>

      <Text style={styles.name}>{friend.name}</Text>

      <View style={styles.infoRow}>
        <View
          style={[
            styles.genderButton,
            friend.gender === "male" && styles.genderButtonMale,
            friend.gender === "other" && styles.genderButtonOther,
          ]}
        >
          <Text style={{ fontSize: moderateScale(16) }}>
            {friend.gender === "female"
              ? "👩"
              : friend.gender === "male"
                ? "👨"
                : "👤"}
          </Text>
        </View>
        <View style={styles.ageButton}>
          <Text style={styles.ageText}>🎂</Text>
          <Text style={styles.ageText}>{friend.age}</Text>
        </View>
      </View>

      <View style={styles.countryContainer}>
        {country && <Text style={styles.flagEmoji}>{country.flag}</Text>}
        <Text style={styles.countryText}>{country?.name || "Unknown"}</Text>
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={handleMessage}
        activeOpacity={0.8}
      >
        <Ionicons
          name="chatbubble"
          size={scale(20)}
          color={theme.colors.white}
        />
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export const FriendCard = memo(FriendCardComponent);
