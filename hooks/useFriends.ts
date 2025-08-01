import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { DUMMY_FRIENDS, type Friend } from "@/data/friends";
import { DUMMY_REQUESTS, type Request } from "@/data/requests";

type SegmentType = "friends" | "requests";

export const useFriends = () => {
  // Refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // State management
  const [selectedSegment, setSelectedSegment] =
    useState<SegmentType>("friends");
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [requestsData, setRequestsData] = useState<Request[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [friendsLoadingMore, setFriendsLoadingMore] = useState(false);
  const [requestsLoadingMore, setRequestsLoadingMore] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [hasRequestsLoaded, setHasRequestsLoaded] = useState(false);

  // Simulate loading friends data on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFriendsData(DUMMY_FRIENDS.slice(0, 10));
      setFriendsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Load requests when switching to requests tab
  useEffect(() => {
    if (selectedSegment === "requests" && !hasRequestsLoaded) {
      setRequestsLoading(true);
      const timer = setTimeout(() => {
        setRequestsData(DUMMY_REQUESTS.slice(0, 10));
        setRequestsLoading(false);
        setHasRequestsLoaded(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedSegment, hasRequestsLoaded]);

  // Set loading state immediately when switching to requests tab
  const handleSegmentPress = useCallback(
    (index: number) => {
      const newSegment = index === 0 ? "friends" : "requests";
      setSelectedSegment(newSegment);

      // If switching to requests and haven't loaded them yet, set loading immediately
      if (newSegment === "requests" && !hasRequestsLoaded) {
        setRequestsLoading(true);
      }
    },
    [hasRequestsLoaded]
  );

  const handleMessage = useCallback((friendId: string) => {
    console.log("Message friend:", friendId);
    // Handle message functionality
  }, []);

  const handleRequestPress = useCallback((request: Request) => {
    setSelectedRequest(request);
    bottomSheetRef.current?.present();
  }, []);

  const handleAcceptRequest = useCallback((requestId: string) => {
    console.log("Accept request:", requestId);
    // Remove from requests and add to friends
    setRequestsData((prev) => prev.filter((req) => req.id !== requestId));
  }, []);

  const handleDeclineRequest = useCallback((requestId: string) => {
    console.log("Decline request:", requestId);
    // Remove from requests
    setRequestsData((prev) => prev.filter((req) => req.id !== requestId));
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  const loadMoreFriends = useCallback(() => {
    if (friendsLoadingMore || friendsData.length >= DUMMY_FRIENDS.length)
      return;

    setFriendsLoadingMore(true);
    setTimeout(() => {
      const nextBatch = DUMMY_FRIENDS.slice(
        friendsData.length,
        friendsData.length + 10
      );
      setFriendsData((prev) => [...prev, ...nextBatch]);
      setFriendsLoadingMore(false);
    }, 1000);
  }, [friendsLoadingMore, friendsData.length]);

  const loadMoreRequests = useCallback(() => {
    if (requestsLoadingMore || requestsData.length >= DUMMY_REQUESTS.length)
      return;

    setRequestsLoadingMore(true);
    setTimeout(() => {
      const nextBatch = DUMMY_REQUESTS.slice(
        requestsData.length,
        requestsData.length + 10
      );
      setRequestsData((prev) => [...prev, ...nextBatch]);
      setRequestsLoadingMore(false);
    }, 1000);
  }, [requestsLoadingMore, requestsData.length]);

  const handleNotificationPress = useCallback(() => {
    console.log("Notification pressed");
  }, []);

  // Computed values
  const friendSkeletons = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-${i}` })),
    []
  );

  return {
    // State
    selectedSegment,
    friendsData,
    requestsData,
    friendsLoading,
    requestsLoading,
    friendsLoadingMore,
    requestsLoadingMore,
    selectedRequest,
    hasRequestsLoaded,

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
  };
};
