import type React from "react";
import { memo, useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/stores/theme.store";
import LottieView from "lottie-react-native";
import type { Request } from "@/data/requests";

interface RequestCardProps {
  request: Request;
  onPress: (request: Request) => void;
}

const RequestCardComponent: React.FC<RequestCardProps> = ({
  request,
  onPress,
}) => {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onPress(request);
  }, [request, onPress]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: scale(theme.borderRadius.lg),
      marginHorizontal: scale(16),
      marginVertical: verticalScale(8),
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      height: verticalScale(120),
    },
    lottieAnimation: {
      width: scale(100),
      height: scale(100),
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LottieView
        source={require("@/assets/animations/new-request.json")}
        style={styles.lottieAnimation}
        autoPlay
        loop
      />
    </TouchableOpacity>
  );
};

export const RequestCard = memo(RequestCardComponent);
