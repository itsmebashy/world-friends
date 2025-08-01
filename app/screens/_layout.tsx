import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-profile" options={{ headerShown: false }} />
      <Stack.Screen name="create-post" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="user-details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="user-posts/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="post-details/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
