import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import LottieView from "lottie-react-native";
import { useTheme } from "@/stores/theme.store";
import { ScreenHeader } from "@/components/ScreenHeader";

interface ScreenLoadingProps {
  onBack?: () => void;
}

export const ScreenLoading: React.FC<ScreenLoadingProps> = ({ onBack }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    spinner: {
      width: scale(120),
      height: scale(120),
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Loading" onBack={onBack} rightComponent={null} />
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("@/assets/animations/spinner.json")}
          style={styles.spinner}
          autoPlay
          loop
        />
      </View>
    </SafeAreaView>
  );
};
