import type React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ConversationItemSkeleton: React.FC = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileImage: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(theme.borderRadius.full),
      marginRight: scale(12),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: verticalScale(4),
    },
    name: {
      width: scale(120),
      height: verticalScale(18),
      borderRadius: scale(theme.borderRadius.sm),
    },
    timeAgo: {
      width: scale(40),
      height: verticalScale(14),
      borderRadius: scale(theme.borderRadius.sm),
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    lastMessage: {
      flex: 1,
      height: verticalScale(16),
      borderRadius: scale(theme.borderRadius.sm),
      marginRight: scale(8),
    },
    unreadIndicator: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
  });

  const shimmerColors = [
    theme.colors.surfaceSecondary,
    theme.colors.border,
    theme.colors.surfaceSecondary,
  ];

  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        shimmerColors={shimmerColors}
        style={styles.profileImage}
      />

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.name}
          />
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.timeAgo}
          />
        </View>

        <View style={styles.bottomRow}>
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.lastMessage}
          />
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.unreadIndicator}
          />
        </View>
      </View>
    </View>
  );
};

interface ConversationListSkeletonProps {
  itemCount?: number;
}

export const ConversationListSkeleton: React.FC<
  ConversationListSkeletonProps
> = ({ itemCount = 10 }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: verticalScale(100), // Account for fixed header
      paddingBottom:
        Platform.OS === "ios" ? verticalScale(100) : verticalScale(80),
    },
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: itemCount }, (_, index) => (
        <ConversationItemSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
};
