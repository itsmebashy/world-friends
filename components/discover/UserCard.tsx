import type React from "react";
import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { getCountryByCode, getLanguageByCode } from "@/constants/user-data";
import { getGreetingByCode } from "@/constants/greetings";
import type { UserCardData } from "@/types/user";

interface UserCardProps {
  user: UserCardData;
  onViewProfile: (userId: string) => void;
}

const UserCardComponent: React.FC<UserCardProps> = ({
  user,
  onViewProfile,
}) => {
  const theme = useTheme();
  const [imageLoadError, setImageLoadError] = useState(false);

  const country = getCountryByCode(user.countryCode);
  const greeting = getGreetingByCode(user.greetingCode);

  const spokenLanguages = user.spokenLanguageCodes
    .map((code) => getLanguageByCode(code)?.name)
    .filter(Boolean)
    .join(", ");

  const learningLanguages = user.learningLanguageCodes
    .map((code) => getLanguageByCode(code)?.name)
    .filter(Boolean)
    .join(", ");

  const handleImageError = useCallback(() => {
    setImageLoadError(true);
  }, []);

  const handleViewProfile = useCallback(() => {
    onViewProfile(user.id);
  }, [user.id, onViewProfile]);

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
    genderText: {
      fontSize: moderateScale(14),
      color: theme.colors.white,
      fontWeight: "600",
      marginLeft: scale(4),
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
    greetingContainer: {
      alignItems: "center",
      marginBottom: verticalScale(20),
    },
    greetingEmoji: {
      fontSize: moderateScale(14),
      marginBottom: verticalScale(8),
    },
    greetingText: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: greeting?.color || theme.colors.success,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: scale(theme.borderRadius.md),
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(10),
      width: "100%",
    },
    detailIcon: {
      marginRight: scale(12),
    },
    detailLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginRight: scale(8),
    },
    detailValue: {
      fontSize: moderateScale(14),
      color: theme.colors.text,
      fontWeight: "600",
      flexShrink: 1,
    },
    flagEmoji: {
      fontSize: moderateScale(16),
      marginRight: scale(8),
    },
    viewProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: verticalScale(14),
      borderRadius: scale(theme.borderRadius.full),
      width: "100%",
      marginTop: verticalScale(10),
    },
    viewProfileButtonText: {
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
            source={{ uri: user.profilePicture }}
            style={styles.profileImage}
            onError={handleImageError}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        )}
      </View>

      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.infoRow}>
        <View
          style={[
            styles.genderButton,
            user.gender === "male" && styles.genderButtonMale,
          ]}
        >
          <Text style={{ fontSize: moderateScale(16) }}>
            {user.gender === "female"
              ? "👩"
              : user.gender === "male"
                ? "👨"
                : "👤"}
          </Text>
        </View>
        <View style={styles.ageButton}>
          <Text style={styles.ageText}>🎂</Text>
          <Text style={styles.ageText}>{user.age}</Text>
        </View>
      </View>

      {greeting && (
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
          <Text style={[styles.greetingText, { color: greeting.color }]}>
            {greeting.greeting}
          </Text>
        </View>
      )}

      <View style={styles.detailRow}>
        <Ionicons
          name="location-outline"
          size={scale(20)}
          color={theme.colors.error}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>Country:</Text>
        {country && <Text style={styles.flagEmoji}>{country.flag}</Text>}
        <Text style={styles.detailValue}>{country?.name || "Unknown"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons
          name="language-outline"
          size={scale(20)}
          color={theme.colors.success}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>Speaks:</Text>
        <Text style={styles.detailValue}>{spokenLanguages || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons
          name="earth-outline"
          size={scale(20)}
          color={theme.colors.info}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>Learning:</Text>
        <Text style={styles.detailValue}>{learningLanguages || "N/A"}</Text>
      </View>

      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={handleViewProfile}
        activeOpacity={0.8}
      >
        <Ionicons name="person" size={scale(20)} color={theme.colors.white} />
        <Text style={styles.viewProfileButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export const UserCard = memo(UserCardComponent);
