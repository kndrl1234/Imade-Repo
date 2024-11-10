import React from 'react';
import { View, Text, Image } from 'react-native';
import { Content } from "providers/types"

const ContentItem: React.FC<Partial<Content>> = ({ title, username, thumbnail_url }) => {
  const thumbnailWidth = 128; // Doubled from 64
  const thumbnailHeight = (thumbnailWidth * 9) / 16; // This calculates the height for a 16:9 ratio

  return (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
      {thumbnail_url ? (
        <Image
          source={{ uri: thumbnail_url }}
          style={{ width: thumbnailWidth, height: thumbnailHeight }}
          className="rounded-lg mr-4"
        />
      ) : (
        <View 
          style={{ width: thumbnailWidth, height: thumbnailHeight }}
          className="bg-gray-300 rounded-lg mr-4"
        />
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800 mb-2" numberOfLines={2}>
          {title || "Unknown Title"}
        </Text>
        <Text className="text-base text-gray-600">
          by {username || "Unknown User"}
        </Text>
      </View>
    </View>
  );
};

export default ContentItem;