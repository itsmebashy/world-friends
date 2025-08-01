import type React from "react";
import { memo, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import type { ConversationData } from "@/data/conversations";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ConversationItemProps {
  conversation: ConversationData;
  onPress: (conversationId: string) => void;
}

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

const ConversationItemComponent: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const theme = useTheme();
  const [imageLoadError, setImageLoadError] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(() => {
    onPress(conversation.id);
  }, [conversation.id, onPress]);

  const handleImageError = useCallback(() => {
    setImageLoadError(true);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileImageContainer: {
      marginRight: scale(12),
    },
    profileImage: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.surfaceSecondary,
    },
    profileImageError: {
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: "center",
      alignItems: "center",
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
      fontSize: moderateScale(16),
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
      marginRight: scale(8),
    },
    timeAgo: {
      fontSize: moderateScale(12),
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    lastMessage: {
      fontSize: moderateScale(14),
      color: theme.colors.textSecondary,
      flex: 1,
      marginRight: scale(8),
      lineHeight: moderateScale(18),
    },
    unreadIndicator: {
      width: scale(10),
      height: scale(10),
      marginBottom: verticalScale(4),
      borderRadius: scale(5),
      backgroundColor: theme.colors.error,
      alignSelf: "flex-end",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.profileImageContainer}>
        {imageLoadError ? (
          <View style={[styles.profileImage, styles.profileImageError]}>
            <Text
              style={{
                fontSize: moderateScale(14),
                color: theme.colors.textMuted,
              }}
            >
              👤
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: conversation.user.profilePicture }}
            style={styles.profileImage}
            onError={handleImageError}
          />
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.user.name}
          </Text>
          <Text style={styles.timeAgo}>
            {formatTimeAgo(conversation.lastMessage.createdAt)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={styles.lastMessage}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {conversation.lastMessage.content}
          </Text>
          {conversation.hasUnreadMessages && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConversationItem = memo(ConversationItemComponent);

interface ConversationListProps {
  conversations: ConversationData[];
  onConversationPress: (conversationId: string) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

const ConversationListComponent: React.FC<ConversationListProps> = ({
  conversations,
  onConversationPress,
  onLoadMore,
  isLoadingMore = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: ConversationData }) => (
      <ConversationItem conversation={item} onPress={onConversationPress} />
    ),
    [onConversationPress]
  );

  const keyExtractor = useCallback((item: ConversationData) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [isLoadingMore, onLoadMore]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    const styles = StyleSheet.create({
      footer: {
        paddingVertical: verticalScale(16),
        alignItems: "center",
      },
      loadingText: {
        fontSize: moderateScale(14),
        color: theme.colors.textMuted,
        fontWeight: "500",
      },
    });

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [isLoadingMore, theme]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <FlashList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={verticalScale(74)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + verticalScale(54),
          paddingTop: verticalScale(100), // Account for fixed header
          backgroundColor: theme.colors.surface,
        }}
      />
    </View>
  );
};

export const ConversationList = memo(ConversationListComponent);
