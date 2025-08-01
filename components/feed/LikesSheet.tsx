import React, { forwardRef, useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BottomSheetModal, BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import { type LikeData } from "@/types/feed";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LikesSheetProps {
  postId: Id<"posts">;
}

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

const LikeItem: React.FC<{ like: LikeData }> = ({ like }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.surface,
    },
    profileImage: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      marginRight: scale(12),
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: verticalScale(2),
    },
    timeText: {
      fontSize: moderateScale(13),
      color: theme.colors.textMuted,
    },
    heartIcon: {
      marginLeft: scale(12),
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={like.user.profilePicture}
        style={styles.profileImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {like.user.name}
        </Text>
        <Text style={styles.timeText}>{formatTimeAgo(like._creationTime)}</Text>
      </View>
      <View style={styles.heartIcon}>
        <Ionicons name="heart" size={scale(20)} color={theme.colors.primary} />
      </View>
    </View>
  );
};

export const LikesSheet = forwardRef<BottomSheetModal, LikesSheetProps>(
  ({ postId }, ref) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Paginated query for likes - only call when sheet is open
    const {
      results: likes,
      status,
      loadMore,
      isLoading: loadingMore,
    } = usePaginatedQuery(
      api.feed.getLikes,
      isSheetOpen ? { postId } : "skip",
      { initialNumItems: 20 }
    );

    const snapPoints = useMemo(() => ["80%", "100%"], []);
    const loading = status === "LoadingFirstPage";

    const renderLikeItem = useCallback(
      ({ item }: { item: LikeData }) => <LikeItem like={item} />,
      []
    );

    const renderLoader = () => (
      <View style={loaderStyles.container}>
        <LottieView
          source={require("@/assets/animations/spinner.json")}
          autoPlay
          loop
          style={loaderStyles.spinner}
        />
      </View>
    );

    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        flex: 1,
      },
      header: {
        alignItems: "center",
        paddingVertical: verticalScale(20),
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: "700",
        color: theme.colors.text,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(40),
      },
      emptyText: {
        fontSize: moderateScale(16),
        color: theme.colors.textMuted,
        textAlign: "center",
      },
    });

    const loaderStyles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: verticalScale(40),
      },
      spinner: {
        width: scale(40),
        height: scale(40),
      },
    });

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
        keyboardBehavior="fillParent"
        enableDynamicSizing={false}
        bottomInset={insets.bottom}
        onChange={(index) => setIsSheetOpen(index >= 0)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Likes</Text>
          </View>

          {loading ? (
            renderLoader()
          ) : !likes || likes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          ) : (
            <BottomSheetFlashList
              data={likes}
              keyExtractor={(item) => item._id}
              renderItem={renderLikeItem}
              estimatedItemSize={80}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </BottomSheetModal>
    );
  }
);

LikesSheet.displayName = "LikesSheet";
