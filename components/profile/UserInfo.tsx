import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ImagePickerModal from "components/profile/ImagePickerModal";
import DescriptionChange from "components/profile/DescriptionChange";
import ListofFollow from "components/profile/ListofFollow";
import { Profile } from '~/providers/types';

interface UserInfoProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Partial<Profile>) => void;
  onSettingsPress: () => void;
}

function UserInfo({ profile, onProfileUpdate, onSettingsPress  }: UserInfoProps) {
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [isDescriptionChangeVisible, setDescriptionChangeVisible] = useState(false);
  const [isFollowListVisible, setFollowListVisible] = useState(false);
  const [followListType, setFollowListType] = useState<'Followers' | 'Following'>('Followers');

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    onProfileUpdate({ avatar_url: newAvatarUrl });
    setImagePickerVisible(false);
  };

  const handleDescriptionUpdate = (newDescription: string) => {
    onProfileUpdate({ description: newDescription });
    setDescriptionChangeVisible(false);
  };

  const handleFollowListOpen = (type: 'Followers' | 'Following') => {
    setFollowListType(type);
    setFollowListVisible(true);
  };

  return (
    <SafeAreaView>
      <View className="px-4 py-6">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => setImagePickerVisible(true)}
            className="relative"
          >
            <Image
              source={{ uri: profile.avatar_url || 'https://via.placeholder.com/100' }}
              className="w-20 h-20 rounded-full border-2 border-gray-100"
            />
            <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
              <AntDesign name="plus" size={12} color="white" />
            </View>
          </TouchableOpacity>
          
          <View className="flex-1 flex-row justify-around ml-4">
            <TouchableOpacity 
              onPress={() => handleFollowListOpen('Followers')}
              className="items-center"
            >
              <Text className="text-xl font-bold">{profile.follower_number || '0'}</Text>
              <Text className="text-sm text-gray-600">Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleFollowListOpen('Following')}
              className="items-center"
            >
              <Text className="text-xl font-bold">{profile.following_number || '0'}</Text>
              <Text className="text-sm text-gray-600">Following</Text>
            </TouchableOpacity>
            
            <View className="items-center">
              <Text className="text-xl font-bold">{profile.content_number || '0'}</Text>
              <Text className="text-sm text-gray-600">Posts</Text>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="font-semibold text-base">{profile.full_name || profile.username}</Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-gray-600 flex-1 mr-2">
              {profile.description || 'No description yet'}
            </Text>
            <TouchableOpacity 
              onPress={() => setDescriptionChangeVisible(true)}
              className="p-2"
            >
              <AntDesign name="edit" size={16} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ImagePickerModal 
        isVisible={isImagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onImageSelected={handleAvatarUpdate}
        username={profile.username || ''}
      />
      <Modal
        visible={isDescriptionChangeVisible}
        animationType="slide"
        onRequestClose={() => setDescriptionChangeVisible(false)}
      >
        <DescriptionChange
          initialDescription={profile.description || ''}
          onSave={handleDescriptionUpdate}
          onCancel={() => setDescriptionChangeVisible(false)}
        />
      </Modal>
      <Modal
        visible={isFollowListVisible}
        animationType="slide"
        onRequestClose={() => setFollowListVisible(false)}
      >
        <View className="flex-1">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setFollowListVisible(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{followListType}</Text>
            <View style={{ width: 24 }} />
          </View>
          <ListofFollow />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default UserInfo;