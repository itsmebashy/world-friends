import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useTheme } from "@/stores/theme.store";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  type: "tab" | "screen";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  type,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: scale(32),
      // For tab type: position between tab header and bottom tab bar
      // For screen type: position between screen header and bottom
      paddingTop: type === "tab" ? verticalScale(20) : verticalScale(40),
      paddingBottom: type === "tab" ? verticalScale(120) : verticalScale(60),
    },
    animationContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: verticalScale(90),
    },
    lottieAnimation: {
      width: scale(180),
      height: scale(180),
    },
    textContainer: {
      alignItems: "center",
      justifyContent: "flex-end",
      flex: type === "tab" ? 0 : 1,
    },
    title: {
      fontSize: moderateScale(14),
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: verticalScale(8),
      lineHeight: moderateScale(24),
    },
    subtitle: {
      fontSize: moderateScale(14),
      color: theme.colors.textMuted,
      textAlign: "center",
      fontWeight: "500",
      lineHeight: moderateScale(14),
      maxWidth: scale(280),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require("@/assets/animations/feed.json")}
          style={styles.lottieAnimation}
          autoPlay
          loop
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};
