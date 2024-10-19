import React, { useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import UserInfo from "components/profile/UserInfo";
import UserActionButtons from 'components/profile/UserActionButtons';
import { RequireAuth } from '../../components/auth/RequireAuth';
import { Profile } from '~/providers/types';
import { useUpdateAuthenticatedProfile } from '~/api/UserData/profile';
import { useAuth } from '~/providers/AuthProvider';
import SettingsModal from "components/profile/settingsModal";
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { profile, isLoading, signOut } = useAuth();
  const updateProfileMutation = useUpdateAuthenticatedProfile();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
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
          <View className="flex-1">
            <UserInfo 
              profile={profile} 
              onProfileUpdate={handleProfileUpdate}
              onSettingsPress={() => setIsSettingsVisible(true)}
            />
            <UserActionButtons />
          </View>
        </SafeAreaView>
        <SettingsModal 
          isVisible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
          onSignOut={handleSignOut}
        />
      </SafeAreaProvider>
    </RequireAuth>
  );
}