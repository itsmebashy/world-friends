import { useTheme } from "@/stores/theme.store"
import { Ionicons } from "@expo/vector-icons"
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { forwardRef, useMemo } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"

export interface ActionSheetOption {
  id: string
  title: string
  icon: string
  color?: string
  onPress: () => void
}

interface ActionSheetProps {
  options: ActionSheetOption[]
}

export const ActionSheet = forwardRef<BottomSheetModal, ActionSheetProps>(({ options }, ref) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const snapPoints = useMemo(() => ["15%"], [])

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: scale(20),
      paddingBottom: insets.bottom + verticalScale(20),
    },
    header: {
      alignItems: "center",
      paddingVertical: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: verticalScale(8),
    },
    headerLine: {
      width: scale(40),
      height: verticalScale(4),
      backgroundColor: theme.colors.textMuted,
      borderRadius: scale(theme.borderRadius.full),
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      borderRadius: scale(theme.borderRadius.md),
      marginVertical: verticalScale(4),
    },
    optionText: {
      fontSize: moderateScale(16),
      fontWeight: "500",
      marginLeft: scale(12),
    },
  })

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      bottomInset={insets.bottom}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        {options.map((option) => (
          <TouchableOpacity key={option.id} style={styles.option} onPress={option.onPress} activeOpacity={0.7}>
            <Ionicons name={option.icon as any} size={scale(20)} color={option.color || theme.colors.text} />
            <Text style={[styles.optionText, { color: option.color || theme.colors.text }]}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  )
})

ActionSheet.displayName = "ActionSheet"