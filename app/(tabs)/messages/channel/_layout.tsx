import { Stack } from "expo-router";

export default function ChannelLayout() {
  return <Stack>
    <Stack.Screen name="[cid]" options={{headerShown: false}} />
  </Stack>
}
