import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabase';
import { decode } from 'base64-arraybuffer';

interface ImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImageSelected: (newAvatarUrl: string) => void;
  username: string;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({ isVisible, onClose, onImageSelected, username }) => {
  const handleImageSelection = async (useCamera: boolean) => {
    const pickerMethod = useCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await pickerMethod({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });

      const base64WithoutPrefix = base64.split(',')[1];
      const fileName = `avatar_${username}_${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64WithoutPrefix), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;
      
      onImageSelected(publicUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white p-4 rounded-t-lg">
          <TouchableOpacity className="py-2" onPress={() => handleImageSelection(false)}>
            <Text className="text-lg text-center">Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2" onPress={() => handleImageSelection(true)}>
            <Text className="text-lg text-center">Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2" onPress={onClose}>
            <Text className="text-lg text-center text-red-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;