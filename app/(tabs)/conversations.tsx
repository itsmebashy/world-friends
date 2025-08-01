import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/stores/theme.store';
import { TabHeader } from '@/components/TabHeader';
import { ConversationList } from '@/components/conversations/ConversationList';
import { ConversationListSkeleton } from '@/components/conversations/ConversationListSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { DUMMY_CONVERSATIONS, type ConversationData } from '@/data/conversations';

export default function ConversationsScreen() {
  const theme = useTheme();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  }), [theme]);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Load first 10 conversations
      const initialConversations = DUMMY_CONVERSATIONS.slice(0, 10);
      setConversations(initialConversations);
      setLoading(false);
      setHasMoreData(DUMMY_CONVERSATIONS.length > 10);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMoreData) return;

    setLoadingMore(true);

    // Simulate loading more data
    setTimeout(() => {
      const currentLength = conversations.length;
      const nextBatch = DUMMY_CONVERSATIONS.slice(currentLength, currentLength + 10);

      if (nextBatch.length > 0) {
        setConversations(prev => [...prev, ...nextBatch]);
        setHasMoreData(currentLength + nextBatch.length < DUMMY_CONVERSATIONS.length);
      } else {
        setHasMoreData(false);
      }

      setLoadingMore(false);
    }, 1000);
  }, [conversations.length, loadingMore, hasMoreData]);

  const handleConversationPress = useCallback((conversationId: string) => {
    // Handle conversation press - navigate to chat screen
    console.log('Conversation pressed:', conversationId);
    // TODO: Navigate to chat screen with conversationId
  }, []);

  const handleNotificationPress = useCallback(() => {
    // Handle notification press
    console.log('Notification pressed');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {loading ? (
        <ConversationListSkeleton />
      ) : conversations.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          subtitle="Start connecting with language partners to begin conversations!"
          type="tab"
        />
      ) : (
        <ConversationList
          conversations={conversations}
          onConversationPress={handleConversationPress}
          onLoadMore={hasMoreData ? handleLoadMore : undefined}
          isLoadingMore={loadingMore}
        />
      )}
      <TabHeader
        title="Conversations"
        onNotificationPress={handleNotificationPress}
        hasNotification={false}
      />
    </SafeAreaView>
  );
}