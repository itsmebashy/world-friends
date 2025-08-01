import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/stores/theme.store";

interface GreetingsProps {
  onCreatePost?: () => void;
}

export const Greetings: React.FC<GreetingsProps> = ({ onCreatePost }) => {
  const theme = useTheme();

  const { greeting, timeEmoji } = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { greeting: "Good morning", timeEmoji: "🌄" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good afternoon", timeEmoji: "☀️" };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: "Good evening", timeEmoji: "🌅" };
    } else {
      return { greeting: "Good night", timeEmoji: "🌙" };
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: scale(16),
      marginVertical: verticalScale(12),
      borderRadius: scale(theme.borderRadius.xl),
      padding: scale(20),
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
      flexDirection: "column",
      alignItems: "center",
    },
    greetingSection: {
      width: "100%",
      marginBottom: verticalScale(16),
    },
    greetingText: {
      fontSize: moderateScale(24),
      fontWeight: "800",
      color: theme.colors.text,
      textAlign: "center",
    },
    postButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: scale(50),
      paddingVertical: verticalScale(10),
      borderRadius: scale(theme.borderRadius.lg),
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    postButtonText: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.white,
      marginLeft: scale(6),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>
          {greeting}, {timeEmoji}
        </Text>
      </View>
      {onCreatePost && (
        <TouchableOpacity
          style={styles.postButton}
          onPress={onCreatePost}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={scale(20)} color={theme.colors.white} />
          <Text style={styles.postButtonText}>Write something</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
