import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function Index() {
  return (
    <>
      <AuthLoading>
        <ActivityIndicator />
      </AuthLoading>
      <Authenticated>
        <Redirect href="/(tabs)" />
      </Authenticated>
      <Unauthenticated>
        <Redirect href="./(auth)" />
      </Unauthenticated>
    </>
  );
}
