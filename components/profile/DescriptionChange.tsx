import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface DescriptionChangeProps {
  initialDescription: string;
  onSave: (newDescription: string) => void;
  onCancel: () => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

const DescriptionChange: React.FC<DescriptionChangeProps> = ({ initialDescription, onSave, onCancel }) => {
  const [description, setDescription] = useState(initialDescription);

  const handleSave = () => {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      onSave(description);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={onCancel}>
            <Text className="text-base text-gray-500">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Edit Info</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-base text-blue-500 font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 bg-gray-100 rounded-lg p-4">
          <TextInput
            className="flex-1 text-base"
            multiline
            placeholder="Write a description..."
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </View>
        <View className="mt-4">
          <Text className="text-sm text-gray-500 text-center">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DescriptionChange;