import React, { useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import UserInfo from "components/profile/UserInfo";
import UserActionButtons from 'components/profile/UserActionButtons';
import { RequireAuth } from '../../components/auth/RequireAuth';
import { Profile } from '~/providers/types';
import { useUpdateAuthenticatedProfile } from '~/api/UserData/profile';
import { useAuth } from '~/providers/AuthProvider';
import SettingsModal from "components/profile/settingsModal";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NotificationsModal from 'components/profile/Notifications';

export default function ProfileScreen() {
  const { profile, isLoading, signOut } = useAuth();
  const updateProfileMutation = useUpdateAuthenticatedProfile();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const router = useRouter();

  const handleProfileUpdate = (updatedProfile: Partial<Profile>) => {
    if (profile) {
      updateProfileMutation.mutate({
        userId: profile.id,
        newProfileData: updatedProfile
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsSettingsVisible(false);
    router.replace('/login');
  };

  if (isLoading || !profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <RequireAuth>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-100">
              <Text className="text-xl font-bold">{profile?.username || 'Profile'}</Text>
              <View className="flex-row items-center space-x-6">
                <TouchableOpacity 
                  onPress={() => setIsNotificationsVisible(true)}
                  className="p-2"
                >
                  <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => router.push('/messages')}
                  className="p-2"
                >
                  <Ionicons name="mail-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setIsSettingsVisible(true)}
                  className="p-2"
                >
                  <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-shrink-0">
              <UserInfo 
                profile={profile} 
                onProfileUpdate={handleProfileUpdate}
                onSettingsPress={() => setIsSettingsVisible(true)}
              />
            </View>
            <View className="flex-1">
              <UserActionButtons />
            </View>
          </View>
        </SafeAreaView>
        <SettingsModal 
          isVisible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
          onSignOut={handleSignOut}
        />
        <NotificationsModal 
          isVisible={isNotificationsVisible}
          onClose={() => setIsNotificationsVisible(false)}
        />
      </SafeAreaProvider>
    </RequireAuth>
  );
}