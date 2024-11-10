import React from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from 'providers/AuthProvider';

export default function TopBar({ activeTab, setActiveTab }) {
  const { session } = useAuth();
  const router = useRouter();

  const handleTabPress = (tab) => {
    if (session) {
      setActiveTab(tab);
    } else {
      router.push('../(auth)/login');
    }
  };

  return (
    <SafeAreaView className="w-full bg-white">
      <View className="flex-row justify-evenly py-1">
        <TouchableOpacity 
          className="px-4" 
          onPress={() => handleTabPress('forYou')}
        >
          <Text className={`text-lg ${activeTab === 'forYou' ? 'text-black font-bold' : 'text-gray-400'}`}>
            For You
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="px-4" 
          onPress={() => handleTabPress('explore')}
        >
          <Text className={`text-lg ${activeTab === 'explore' ? 'text-black font-bold' : 'text-gray-400'}`}>
            Explore
          </Text>
        </TouchableOpacity>
        <Link href={{
          pathname: '/search',
        }} asChild>
        <TouchableOpacity 
          className="px-4"
        >
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}