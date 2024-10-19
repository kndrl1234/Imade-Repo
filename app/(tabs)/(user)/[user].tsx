import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Profile, Content } from '~/providers/types';
import { useLikedPosts } from '~/api/UserData/likes';
import { useSavedPosts } from '~/api/UserData/saves';
import { useUserContent } from '~/api/UserData/content';
import { useUserProfile } from '~/api/UserData/profile';
import ContentItem from '~/components/profile/ContentItem';

type TabType = 'content' | 'likes' | 'saves';

export default function UserProfile() {
  const { user: username } = useLocalSearchParams<{ user: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const { data: profile, isLoading: profileLoading } = useUserProfile(username);
  const { data: likedPosts, isLoading: likesLoading } = useLikedPosts(profile?.id);
  const { data: savedPosts, isLoading: savesLoading } = useSavedPosts(profile?.id);
  const { data: userContent, isLoading: contentLoading } = useUserContent(profile?.id);

  const renderItem = ({ item }: { item: Content }) => (
    <ContentItem
      title={item.title}
      username={item.username}
      thumbnail_url={item.thumbnail_url}
    />
  );

  const getActiveData = (): Content[] => {
    switch (activeTab) {
      case 'likes':
        return likedPosts || [];
      case 'saves':
        return savedPosts || [];
      case 'content':
        return userContent || [];
    }
  };

  const isLoading = profileLoading || likesLoading || savesLoading || contentLoading;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-600">User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
        <Text className="text-xl font-bold">{profile.username}</Text>
      </View>
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <Image
          source={{ uri: profile.avatar_url || 'https://via.placeholder.com/100' }}
          className="w-24 h-24 rounded-full"
        />
        <View className="flex-row justify-around flex-1 ml-4">
          <ProfileStat label="Followers" value={profile.follower_number} />
          <ProfileStat label="Following" value={profile.following_number} />
        </View>
      </View>
      <View className="px-4 py-2 border-b border-gray-200">
        <Text className="text-gray-700">{profile.description}</Text>
      </View>
      
      <View className="flex-row justify-around mt-4">
        <TabButton label="Likes" isActive={activeTab === 'likes'} onPress={() => setActiveTab('likes')} />
        <TabButton label="Saves" isActive={activeTab === 'saves'} onPress={() => setActiveTab('saves')} />
        <TabButton label="Content" isActive={activeTab === 'content'} onPress={() => setActiveTab('content')} />
      </View>
      <View className="flex-1 bg-gray-100">
        {getActiveData().length === 0 ? (
          <Text className="text-lg text-gray-600 text-center mt-4">This user has no {activeTab} yet...</Text>
        ) : (
          <FlatList
            data={getActiveData()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const ProfileStat = ({ label, value }: { label: string; value: number }) => (
  <View className="items-center">
    <Text className="text-base font-semibold text-gray-700">{label}</Text>
    <Text className="text-lg font-bold">{value}</Text>
  </View>
);

const TabButton = ({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className={`px-4 py-2 rounded-lg ${isActive ? 'bg-blue-500' : ''}`}>
    <Text className={isActive ? 'text-white' : 'text-black'}>{label}</Text>
  </TouchableOpacity>
);