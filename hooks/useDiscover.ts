import { useState, useCallback, useRef, useMemo } from "react";
import { router, useFocusEffect } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { usePaginatedQuery } from "convex/react";
import { useFilterStore } from "@/stores/filter.store";
import { api } from "@/convex/_generated/api";

const INITIAL_LOAD_COUNT = 10;

export const useDiscover = () => {
  // Filter store
  const {
    selectedCountry,
    selectedLanguageSpoken,
    selectedLanguageLearning,
    resetFilters,
  } = useFilterStore();

  // State
  const [searchText, setSearchText] = useState("");

  // Refs
  const filterSheetRef = useRef<BottomSheetModal>(null);

  // Determine which query to use based on current state
  const hasActiveFilters = useMemo(() => {
    return !!(
      selectedCountry ||
      selectedLanguageSpoken ||
      selectedLanguageLearning
    );
  }, [selectedCountry, selectedLanguageSpoken, selectedLanguageLearning]);

  const isSearching = useMemo(() => {
    return searchText.length >= 3;
  }, [searchText.length]);

  // Use appropriate Convex query based on current state
  const discoverQuery = usePaginatedQuery(
    api.discover.getDiscoverUsers,
    {},
    {
      initialNumItems: INITIAL_LOAD_COUNT,
    }
  );

  const searchQuery = usePaginatedQuery(
    api.discover.searchDiscoverUsers,
    isSearching ? { searchQuery: searchText } : "skip",
    {
      initialNumItems: INITIAL_LOAD_COUNT,
    }
  );

  const filterQuery = usePaginatedQuery(
    api.discover.filterDiscoverUsers,
    hasActiveFilters
      ? {
          countryCode: selectedCountry || undefined,
          spokenLanguageCode: selectedLanguageSpoken || undefined,
          learningLanguageCode: selectedLanguageLearning || undefined,
        }
      : "skip",
    {
      initialNumItems: INITIAL_LOAD_COUNT,
    }
  );

  // Select the appropriate query result based on current state
  const currentQuery = useMemo(() => {
    if (isSearching) return searchQuery;
    if (hasActiveFilters) return filterQuery;
    return discoverQuery;
  }, [isSearching, hasActiveFilters, searchQuery, filterQuery, discoverQuery]);

  // Reset filters when screen loses focus (user leaves the screen)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // This runs when the screen loses focus
        resetFilters();
      };
    }, [resetFilters])
  );

  // Extract data from current query
  const users = currentQuery.results || [];
  const loading = currentQuery.status === "LoadingFirstPage";
  const loadingMore = currentQuery.status === "LoadingMore";
  const canLoadMore = currentQuery.status === "CanLoadMore";

  // Event handlers
  const handleNotificationPress = useCallback(() => {
    console.log("Notification pressed on Discover screen");
    // Example navigation: router.push('/notifications');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchText(query);
  }, []);

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const handleViewProfile = useCallback((userId: string) => {
    console.log("View profile for user:", userId);
    router.push(`/screens/user-details/${userId}`);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (canLoadMore) {
      currentQuery.loadMore(INITIAL_LOAD_COUNT);
    }
  }, [canLoadMore, currentQuery]);

  // Computed values for UI state
  const isFiltering = useMemo(() => {
    return searchText.length >= 3 || hasActiveFilters;
  }, [searchText.length, hasActiveFilters]);

  return {
    // State
    loading,
    loadingMore,
    filteredUsers: users, // Use users directly as they're already filtered by queries

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
  };
};
