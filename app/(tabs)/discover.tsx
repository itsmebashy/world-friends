import { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/stores/theme.store";
import { TabHeader } from "@/components/TabHeader";
import { UserCard } from "@/components/discover/UserCard";
import { UserCardSkeleton } from "@/components/discover/UserCardSkeleton";
import { SearchBar } from "@/components/discover/SearchBar";
import { FilterSheet } from "@/components/discover/FilterSheet";
import { type UserCardData } from "@/types/user";
import { EmptyState } from "@/components/EmptyState";
import { useDiscover } from "@/hooks/useDiscover";

export default function DiscoverScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    // State
    loading,
    loadingMore,
    filteredUsers,

    // Refs
    filterSheetRef,

    // Event handlers
    handleNotificationPress,
    handleSearch,
    handleFilterPress,
    handleViewProfile,
    handleLoadMore,

    // Computed values
    isFiltering,

    // Constants
    INITIAL_LOAD_COUNT,
  } = useDiscover();

  const renderUserCard = useCallback(
    ({ item }: { item: UserCardData }) => (
      <UserCard user={item} onViewProfile={handleViewProfile} />
    ),
    [handleViewProfile]
  );

  const renderSkeleton = useCallback(() => <UserCardSkeleton />, []);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator />
      </View>
    );
  }, [loadingMore]);

  const renderEmptyState = useCallback(() => {
    if (loading) return null; // Don't show empty state if still loading initially

    return (
      <EmptyState
        title={isFiltering ? "No users found" : "No users available yet"}
        subtitle={
          isFiltering
            ? "Try adjusting your search terms or filters"
            : "Check back later for new language partners!"
        }
        type="tab"
      />
    );
  }, [loading, isFiltering]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        listContainer: {
          flex: 1,
        },
        contentContainer: {
          paddingTop: insets.top + verticalScale(140), // Account for safe area + fixed header + search bar
          paddingBottom: verticalScale(100), // Account for custom tab bar
        },
        footerLoader: {
          paddingVertical: verticalScale(20),
          alignItems: "center",
        },
        footerSpinner: {
          width: scale(30),
          height: scale(30),
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.listContainer}>
        <FlashList
          data={loading ? Array(INITIAL_LOAD_COUNT).fill(null) : filteredUsers}
          renderItem={loading ? renderSkeleton : renderUserCard}
          keyExtractor={(item, index) =>
            loading ? `skeleton-${index}` : item.id
          }
          estimatedItemSize={350} // Estimate based on UserCard height
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
      <TabHeader
        title="Discover"
        onNotificationPress={handleNotificationPress}
        hasNotification={false}
      />
      <SearchBar onSearch={handleSearch} onFilterPress={handleFilterPress} />
      <FilterSheet ref={filterSheetRef} />
    </SafeAreaView>
  );
}
