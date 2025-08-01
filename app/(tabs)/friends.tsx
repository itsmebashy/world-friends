import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/stores/theme.store";
import { TabHeader } from "@/components/TabHeader";
import { SegmentedControl } from "@/components/friends/SegmentedControl";
import { FriendCard } from "@/components/friends/FriendCard";
import { FriendCardSkeleton } from "@/components/friends/FriendCardSkeleton";
import { RequestCard } from "@/components/friends/RequestCard";
import { RequestSheet } from "@/components/friends/RequestSheet";
import { type Friend } from "@/data/friends";
import { type Request } from "@/data/requests";
import LottieView from "lottie-react-native";
import { EmptyState } from "@/components/EmptyState";
import { useFriends } from "@/hooks/useFriends";

export default function FriendsScreen() {
  const theme = useTheme();

  const {
    // State
    selectedSegment,
    friendsData,
    requestsData,
    friendsLoading,
    requestsLoading,
    friendsLoadingMore,
    requestsLoadingMore,
    selectedRequest,

    // Refs
    bottomSheetRef,

    // Event handlers
    handleSegmentPress,
    handleMessage,
    handleRequestPress,
    handleAcceptRequest,
    handleDeclineRequest,
    handleCloseSheet,
    loadMoreFriends,
    loadMoreRequests,
    handleNotificationPress,

    // Computed values
    friendSkeletons,
  } = useFriends();

  // Memoized render functions
  const renderFriendItem = useCallback(
    ({ item }: { item: Friend }) => (
      <FriendCard friend={item} onMessage={handleMessage} />
    ),
    [handleMessage]
  );

  const renderRequestItem = useCallback(
    ({ item }: { item: Request }) => (
      <RequestCard request={item} onPress={handleRequestPress} />
    ),
    [handleRequestPress]
  );

  const renderFriendSkeleton = useCallback(() => <FriendCardSkeleton />, []);

  const renderFriendFooter = useCallback(() => {
    if (!friendsLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [friendsLoadingMore, theme.colors.primary]);

  const renderRequestFooter = useCallback(() => {
    if (!requestsLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [requestsLoadingMore, theme.colors.primary]);

  const renderEmptyFriends = useCallback(() => {
    if (friendsLoading) return null;
    return (
      <EmptyState
        title="No friends yet"
        subtitle="Start connecting with people around the world!"
        type="tab"
      />
    );
  }, [friendsLoading]);

  const renderEmptyRequests = useCallback(() => {
    if (requestsLoading) return null;
    return (
      <EmptyState
        title="No friend requests"
        subtitle="New requests will appear here"
        type="tab"
      />
    );
  }, [requestsLoading]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          flex: 1,
        },
        contentContainer: {
          paddingTop: verticalScale(140), // Account for fixed header + segmented control
          paddingBottom: verticalScale(100), // Account for custom tab bar
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: verticalScale(140), // Account for fixed header + segmented control
        },
        loadingAnimation: {
          width: scale(120),
          height: scale(120),
        },
        loadingFooter: {
          paddingVertical: verticalScale(20),
          alignItems: "center",
        },
      }),
    [theme]
  );

  const renderContent = () => {
    if (selectedSegment === "friends") {
      if (friendsLoading) {
        return (
          <FlashList
            data={friendSkeletons}
            renderItem={renderFriendSkeleton}
            estimatedItemSize={verticalScale(300)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />
        );
      }

      if (friendsData.length === 0) {
        return renderEmptyFriends();
      }

      return (
        <FlashList
          data={friendsData}
          renderItem={renderFriendItem}
          estimatedItemSize={verticalScale(300)}
          onEndReached={loadMoreFriends}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFriendFooter}
          contentContainerStyle={styles.contentContainer}
        />
      );
    } else {
      if (requestsLoading) {
        return (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("@/assets/animations/spinner.json")}
              style={styles.loadingAnimation}
              autoPlay
              loop
            />
          </View>
        );
      }

      if (requestsData.length === 0) {
        return renderEmptyRequests();
      }

      return (
        <FlashList
          data={requestsData}
          renderItem={renderRequestItem}
          estimatedItemSize={verticalScale(140)}
          onEndReached={loadMoreRequests}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderRequestFooter}
          contentContainerStyle={styles.contentContainer}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.content}>{renderContent()}</View>
      <TabHeader
        title="Friends"
        onNotificationPress={handleNotificationPress}
        hasNotification={true}
      />
      <SegmentedControl
        segments={["Friends", "Requests"]}
        selectedIndex={selectedSegment === "friends" ? 0 : 1}
        onSegmentPress={handleSegmentPress}
      />
      <RequestSheet
        ref={bottomSheetRef}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        onClose={handleCloseSheet}
      />
    </SafeAreaView>
  );
}
