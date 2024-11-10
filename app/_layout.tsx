import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../providers/AuthProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useEffect } from 'react';

const queryClient = new QueryClient();
const streamClient = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

function StreamChatConnection() {
  const { profile } = useAuth();

  useEffect(() => {
    const connect = async () => {
      try {
        // First disconnect if already connected
        if (streamClient.userID) {
          await streamClient.disconnectUser();
        }

        if (profile?.id) {
          await streamClient.connectUser(
            {
              id: profile.id,
              name: profile.username,
              image: profile.avatar_url,
            },
            streamClient.devToken(profile.id)
          );
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (profile?.id) {
      connect();
    }

    return () => {
      if (streamClient.userID) {
        streamClient.disconnectUser();
      }
    };
  }, [profile?.id]); // Only depend on profile.id

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OverlayProvider>
            <Chat client={streamClient}>
              <StreamChatConnection />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
            </Chat>
          </OverlayProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}