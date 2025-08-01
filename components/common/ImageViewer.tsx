import type React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import ImageView from "react-native-image-viewing"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { scale } from "react-native-size-matters"
import { useTheme } from "@/stores/theme.store"

interface ImageViewerProps {
  images: Array<{ uri: string }>
  imageIndex: number
  visible: boolean
  onRequestClose: () => void
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ images, imageIndex, visible, onRequestClose }) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create({
    headerContainer: {
      position: "absolute",
      top: insets.bottom + scale(10),
      right: scale(20),
      zIndex: 1, // Ensure it's above the image
    },
    closeButton: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(20),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
  })


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onRequestClose} activeOpacity={0.7}>
        <Ionicons name="close" size={scale(30)} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  )

  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={onRequestClose}
      HeaderComponent={renderHeader}
      swipeToCloseEnabled={true}
      doubleTapToZoomEnabled={true}
      animationType="fade"
      backgroundColor="#0F172A"
      // StatusBar is handled internally by react-native-image-viewing
    />
  )
}
