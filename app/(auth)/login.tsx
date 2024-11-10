import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { supabase } from 'utils/supabase';
import { Link, router } from 'expo-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
            <Image
              source={require("../../assets/images/Name.png")}
              className="w-60 h-40 mb-1"
              resizeMode="contain"
            />
            <Text className="text-sm text-gray-600 text-center">
              You need to log in with your Lodge account to continue your transactions.
            </Text>
        </View>

        <View className="mb-4">
          <TextInput
            className="border border-gray-300 rounded-sm p-3 text-base mb-3"
            placeholder="Phone number, username, or email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            className="border border-gray-300 rounded-sm p-3 text-base"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-sm p-3 items-center mb-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 font-semibold">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity>
          <Text className="text-center text-blue-900 text-sm">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View className="border-t border-gray-300 py-4">
        <Text className="text-center text-sm">
          Don't have an account? <Link href="/(auth)/subscription"><Text className="text-blue-500 font-semibold">Sign up</Text></Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}