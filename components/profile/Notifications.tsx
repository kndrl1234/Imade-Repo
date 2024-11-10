import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

interface NotificationsModalProps {
  isVisible: boolean
  onClose: () => void
}

export default function NotificationsModal({ isVisible, onClose }: NotificationsModalProps) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-bold">Notifications</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View className="flex-row items-center py-3 px-4 border-b border-gray-200">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-sm">
                <Text className="font-bold">emily_smith</Text>
                {' '}liked your photo.
              </Text>
              <Text className="text-xs text-gray-500 mt-1">1h ago</Text>
            </View>
            <TouchableOpacity className="bg-blue-500 rounded-md px-4 py-1">
              <Text className="text-white font-semibold">Follow</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}