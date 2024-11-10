import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { supabase } from 'utils/supabase';
import { router } from 'expo-router';

export default function Subscription() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error: signUpError, data: { user } } = await supabase.auth.signUp({ 
      email, 
      password,
    });
    if (signUpError) {
      Alert.alert('Error', signUpError.message);
      setLoading(false);
      return;
    }

    if (user) {
      // Insert the user's profile data
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username,
        });

      if (insertError) {
        Alert.alert('Error', 'Failed to create profile. Please try again.');
      } else {
        Alert.alert('Success', 'Check your email to confirm your account');
        router.replace('/');
      }
    }
    setLoading(false);
  }
  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <View className="items-center mb-8">
        <Image
          source={require("../../assets/images/Name.png")}
          className="w-60 h-40 mb-1"
          resizeMode="contain"
        />
        <Text className="text-lg font-semibold text-gray-800 mb-2">Subscribe to Continue</Text>
        <Text className="text-sm text-gray-600 text-center">
          Enter your details to create an account and receive updates.
        </Text>
      </View>

      <View className="mb-4">
      <TextInput
          className="border border-gray-300 rounded-md p-3 text-base mb-3"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 rounded-md p-3 text-base mb-3"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 rounded-md p-3 text-base mb-3"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-md p-3 items-center"
        onPress={handleSubscribe}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? 'Creating account...' : 'Subscribe'}
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 text-center mt-4">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}