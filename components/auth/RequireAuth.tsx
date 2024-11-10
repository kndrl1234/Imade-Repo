import React from 'react';
import { useAuth } from '~/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
}