import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';


const SearchPage = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const initSearch = async () => {
      try {
      } catch (err) {
        setError(err.message);
      }
    };

    initSearch();
  }, []);

  const thumbnails = Array.from({ length: 20 }, (_, i) => ({
    id: i.toString(),
    imageUrl: `https://picsum.photos/300/200?random=${i}`,
    title: `Video ${i + 1}`
  }));

  const renderThumbnail = ({ item }) => (
    <TouchableOpacity className="p-2">
      <View className="bg-gray-100 rounded-lg overflow-hidden">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-56 bg-gray-300" // Adjusted height for 16:9 ratio
        />
        <View className="p-2">
          <Text className="text-sm font-medium text-gray-800 truncate">
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white">
        <View className="bg-gray-100 p-4 border-b border-gray-200">
          <View className="flex-row items-center bg-white rounded-full px-4 py-2">
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search videos"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
    
        <FlatList
          data={thumbnails}
          renderItem={renderThumbnail}
          keyExtractor={item => item.id}
          numColumns={1} // Static number of columns
          contentContainerClassName="p-2"
        />
      </View>
    </SafeAreaProvider>

  );
};

export default SearchPage;