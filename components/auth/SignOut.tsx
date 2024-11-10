import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { supabase } from '../../utils/supabase';
import { router } from 'expo-router';

export default function SignOut() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', 'Failed to sign out');
    } else {
      router.replace("/");
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleSignOut}
      className="bg-red-500 py-2 px-4 rounded-md"
    >
      <Text className="text-white font-semibold text-center">Sign Out</Text>
    </TouchableOpacity>
  );
}