import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';

const MessageBoxButton = ({ icon, label, count = null }) => (
  <TouchableOpacity className="bg-white rounded-lg p-2 flex items-center justify-center shadow-sm border border-gray-100 min-w-[70px]">
    <View className="h-6 justify-center">
      {icon}
    </View>
    <Text className="text-xs text-gray-800 text-center mt-1" numberOfLines={1}>
      {label}
    </Text>
    {count && (
      <Text className="text-sm font-semibold text-gray-900">{count}</Text>
    )}
  </TouchableOpacity>
);

const MessageItem = ({ username, message, time, avatar }) => (
  <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
    <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
      <Text className="text-gray-600 font-semibold">{avatar}</Text>
    </View>
    <View className="flex-1 ml-4">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-gray-900">{username}</Text>
        <Text className="text-sm text-gray-500">{time}</Text>
      </View>
      <Text className="text-gray-600 text-sm" numberOfLines={1}>
        {message}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function Messages() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white">
        <Text className="text-2xl font-bold mb-4">Your Message boxes</Text>
        
        {/* Top row of buttons */}
        <View className="flex-row justify-between mb-2">
          <MessageBoxButton 
            icon={<Feather name="eye" size={20} color="black" />}
            label="Guests"
          />
          <MessageBoxButton 
            icon={<AntDesign name="heart" size={20} color="black" />}
            label="Followers"
          />
          <MessageBoxButton 
            icon={<Feather name="bell" size={20} color="black" />}
            label="Initiated"
          />
          <MessageBoxButton
            icon={<AntDesign name="staro" size={20} color="black" />}
            label="New box"
          />
          <MessageBoxButton 
            label="Add"
            icon={<AntDesign name="plus" size={20} color="black" />}
          />
        </View>
      </View>

      <View className="mt-4 bg-white">
        <Text className="px-4 py-3 text-xl font-semibold">Last messages</Text>
        <ScrollView>
          {[1, 2, 3, 4].map((num) => (
            <MessageItem
              key={num}
              username={`User ${num}`}
              message="This is an example comment message that might be longer..."
              time="2m ago"
              avatar={`U${num}`}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}