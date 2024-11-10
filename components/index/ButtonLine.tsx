import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ButtonLine() {

  return (
    <View className="w-full bg-white pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
      <TouchableOpacity
        className="w-20 h-20 bg-red-500 m-2 justify-center items-center rounded-lg"
        onPress={() => console.log("pressed")}
      >
        <Ionicons name="restaurant-outline" size={24} color="white" />
        <Text className="text-white text-lg font-bold">Food</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-20 h-20 bg-red-500 m-2 justify-center items-center rounded-lg"
        onPress={() => console.log("pressed")}
      >
        <Octicons name="paintbrush" size={24} color="white" />
        <Text className="text-white text-lg font-bold">art</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-20 h-20 bg-red-500 m-2 justify-center items-center rounded-lg"
        onPress={() => console.log("pressed")}
      >
        <FontAwesome6 name="person-rays" size={24} color="white" />
        <Text className="text-white text-lg font-bold">growth</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-20 h-20 bg-red-500 m-2 justify-center items-center rounded-lg"
        onPress={() => console.log("pressed")}
      >
        <MaterialIcons name="house-siding" size={24} color="white" />
        <Text className="text-white text-lg font-bold">building</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-20 h-20 bg-red-500 m-2 justify-center items-center rounded-lg"
        onPress={() => console.log("pressed")}
      >
        <MaterialIcons name="house-siding" size={24} color="white" />
        <Text className="text-white text-lg font-bold">building</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}