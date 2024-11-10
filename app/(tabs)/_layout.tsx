import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const { session } = useAuth();
  const router = useRouter();

  const handleTabPress = (tabName: string) => {
    if (!session && (tabName === 'add' || tabName === 'profile')) {
      router.push('/(auth)/login');
      return false; // Prevent default navigation
    }
    return undefined; // Allow default navigation
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 40,
        },
        tabBarActiveTintColor: 'black',
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => (
            <Ionicons name="home-outline" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="add-circle-outline" size={30} color="black" />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (handleTabPress('add') === false) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: () => (
            <Feather name="user" size={30} color="black" />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (handleTabPress('profile') === false) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tabs.Screen
        name="(user)"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
      name="messages"
      options={{
        href: null,
      }}
    />
    </Tabs>
  );
}