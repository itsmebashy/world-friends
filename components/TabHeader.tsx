import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@/stores/theme.store';

interface TabHeaderProps {
  title: string;
  onNotificationPress?: () => void;
  hasNotification?: boolean;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  onNotificationPress,
  hasNotification = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top + verticalScale(8),
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(16),
      borderBottomLeftRadius: scale(theme.borderRadius.xl),
      borderBottomRightRadius: scale(theme.borderRadius.xl),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
    },
    notificationButton: {
      padding: scale(8),
      borderRadius: scale(theme.borderRadius.xl),
      backgroundColor: theme.colors.background,
      position: 'relative',
    },
    notificationDot: {
      position: 'absolute',
      top: scale(6),
      right: scale(6),
      width: scale(8),
      height: scale(8),
      borderRadius: scale(theme.borderRadius.full),
      backgroundColor: theme.colors.notification,
    },
  }), [theme, insets]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="notifications-outline"
          size={scale(20)}
          color={theme.colors.text}
        />
        {hasNotification && <View style={styles.notificationDot} />}
      </TouchableOpacity>
    </View>
  );
};