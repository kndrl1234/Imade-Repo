import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';

interface ContentButtonLineProps {
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
}

export default function ContentButtonLine({
  likeCount,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onComment
}: ContentButtonLineProps) {
  return (
    <View className="flex-row justify-around items-center px-3 py-2 border-gray-100">
      <TouchableOpacity className="flex-row items-center" onPress={onSave}>
        <Fontisto name="bookmark" size={22} color={isSaved ? "orange" : "#333"} />
        <Text className="text-sm ml-2 text-gray-700"></Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center" onPress={onComment}>
        <AntDesign name="message1" size={22} color="#333" />
        <Text className="text-sm ml-2 text-gray-700"></Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center" onPress={onLike}>
        <AntDesign name={isLiked ? "heart" : "hearto"} size={22} color={isLiked ? "orange" : "#333"} />
        <Text className="text-sm ml-2 text-gray-700">{likeCount}</Text>
      </TouchableOpacity>
    </View>
  );
}