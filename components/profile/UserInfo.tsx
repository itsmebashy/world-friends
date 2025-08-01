import React, { memo, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { getCountryByCode } from "@/constants/user-data";

interface UserInfoProps {
  profilePicture: string;
  name: string;
  username: string;
  gender: "male" | "female" | "other";
  age: number;
  countryCode: string;
}

export const UserInfo = memo<UserInfoProps>(
  ({ profilePicture, name, username, gender, age, countryCode }) => {
    const theme = useTheme();
    const [imageLoadError, setImageLoadError] = useState(false);

    const country = getCountryByCode(countryCode);

    const handleImageError = () => {
      setImageLoadError(true);
    };

    const styles = StyleSheet.create({
      container: {
        alignItems: "center",
        paddingVertical: verticalScale(20),
        paddingHorizontal: scale(20),
      },
      profileImageContainer: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
        marginBottom: verticalScale(16),
        position: "relative",
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }),
      },
      profileImagePlaceholder: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: scale(60),
        backgroundColor: theme.colors.surface,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      },
      profileImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: scale(60),
        backgroundColor: theme.colors.surface,
        zIndex: 2,
      },
      name: {
        fontSize: moderateScale(30),
        fontWeight: "700",
        color: theme.colors.text,
        textAlign: "center",
        marginBottom: verticalScale(4),
      },
      username: {
        fontSize: moderateScale(18),
        fontWeight: "500",
        color: theme.colors.textSecondary,
        textAlign: "center",
        marginBottom: verticalScale(12),
      },
      infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: verticalScale(12),
        gap: scale(12),
      },
      genderButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: scale(theme.borderRadius.full),
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      genderButtonMale: {
        backgroundColor: theme.colors.info + "15",
        borderColor: theme.colors.info + "30",
      },
      ageButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        borderRadius: scale(theme.borderRadius.full),
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: scale(4),
      },
      ageText: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: theme.colors.text,
      },
      detailRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surface,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderRadius: scale(theme.borderRadius.full),
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: scale(8),
      },
      countryFlag: {
        fontSize: moderateScale(18),
      },
      countryText: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: theme.colors.text,
      },
    });

    return (
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          {/* Always show person icon as background */}
          <View style={styles.profileImagePlaceholder}>
            <Ionicons
              name="person"
              size={scale(60)}
              color={theme.colors.textMuted}
            />
          </View>

          {/* Show actual image on top if available and not errored */}
          {profilePicture && !imageLoadError && (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profileImage}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
              onError={handleImageError}
              priority="high"
            />
          )}
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>@{username}</Text>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.genderButton,
              gender === "male" && styles.genderButtonMale,
            ]}
          >
            <Text style={{ fontSize: moderateScale(16) }}>
              {gender === "female" ? "👩" : gender === "male" ? "👨" : "👤"}
            </Text>
          </View>
          <View style={styles.ageButton}>
            <Text style={styles.ageText}>🎂</Text>
            <Text style={styles.ageText}>{age}</Text>
          </View>
        </View>

        {country && (
          <View style={styles.detailRow}>
            <Text style={styles.countryFlag}>{country.flag}</Text>
            <Text style={styles.countryText}>{country.name}</Text>
          </View>
        )}
      </View>
    );
  }
);

UserInfo.displayName = "UserInfo";
