import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const SettingItem = ({ icon, title, hasChevron = true, hasSwitch = false, onPress }) => (
  <TouchableOpacity 
    className="flex-row items-center py-4 px-4" 
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <View className="w-8 mr-4">
      {icon}
    </View>
    <Text className="flex-1 text-base">{title}</Text>
    {hasSwitch && <Switch />}
    {hasChevron && <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />}
  </TouchableOpacity>
);

export default function SettingsModal({ isVisible, onClose, onSignOut }) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <ScrollView>
          <View className="border-t border-gray-200" />
          <View className="mt-4">
            <SettingItem icon={<Feather name="bell" size={24} color="#4B5563" />} title="Notifications" />
            <SettingItem icon={<Feather name="lock" size={24} color="#4B5563" />} title="Privacy" />
            <SettingItem icon={<Feather name="user" size={24} color="#4B5563" />} title="Account" />
            <SettingItem icon={<Feather name="help-circle" size={24} color="#4B5563" />} title="Help" />
            <SettingItem icon={<Feather name="info" size={24} color="#4B5563" />} title="About" />
          </View>

          <View className="border-t border-gray-200 my-4" />

          <View>
            <SettingItem 
              icon={<Feather name="moon" size={24} color="#4B5563" />} 
              title="Dark Mode" 
              hasChevron={false} 
              hasSwitch={true} 
            />
          </View>

          <View className="mt-8 mb-4">
            <Text className="text-center text-gray-400 text-sm">Version 1.0.0</Text>
          </View>
        </ScrollView>

        <View className="border-t border-gray-200" />
        <TouchableOpacity 
          className="py-4 px-4 bg-white"
          onPress={onSignOut}
        >
          <Text className="text-center text-red-500 font-semibold">Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="py-4 px-4 bg-gray-100"
          onPress={onClose}
        >
          <Text className="text-center text-blue-500 font-semibold">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}