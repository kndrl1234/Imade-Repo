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
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
        <Text className="text-xl font-bold">{profile.username || 'No Username'}</Text>
        <TouchableOpacity onPress={onSettingsPress}>
          <AntDesign name="setting" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => setImagePickerVisible(true)}>
          <Image
            source={{ uri: profile.avatar_url || 'https://via.placeholder.com/100' }}
            className="w-24 h-24 rounded-full"
          />
        </TouchableOpacity>
        <View className="flex-row justify-around flex-1 ml-4">
          <TouchableOpacity onPress={() => handleFollowListOpen('Followers')}>
            <View className="items-center">
              <Text className="text-base font-semibold text-gray-700">Followers</Text>
              <Text className="text-lg font-bold">
                {profile.follower_number || '0'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFollowListOpen('Following')}>
            <View className="items-center">
              <Text className="text-base font-semibold text-gray-700">Following</Text>
              <Text className="text-lg font-bold">
                {profile.following_number || '0'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View className="pt-2 pb-5 pl-2 border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-700 flex-1">{profile.description || ''}</Text>
        <TouchableOpacity onPress={() => setDescriptionChangeVisible(true)}>
          <AntDesign name="edit" size={20} color="black" />
        </TouchableOpacity>
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