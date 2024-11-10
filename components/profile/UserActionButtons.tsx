import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useLikedPosts } from '../../api/UserData/likes';
import { useSavedPosts } from '../../api/UserData/saves';
import { useAuthenticatedUserContent } from '../../api/UserData/content';
import { supabase } from '../../utils/supabase';
import ContentItem from './ContentItem';
import { Content } from 'providers/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserActionButtons() {
    const [activeTab, setActiveTab] = useState('content');
    const [currentUser, setCurrentUser] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        async function getCurrentUser() {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current user in UserActionButtons:', user ? user.id : 'Not authenticated');
            setCurrentUser(user);
        }
        getCurrentUser();
    }, []);

    const { data: likedPosts, isLoading: likesLoading, error: likesError } = useLikedPosts(currentUser?.id);
    const { data: savedPosts, isLoading: savesLoading, error: savesError } = useSavedPosts(currentUser?.id);
    const { data: userContent, isLoading: contentLoading, error: contentError } = useAuthenticatedUserContent(currentUser?.id);

    const renderItem = ({ item }: { item: Content }) => (
        <ContentItem
            title={item.title}
            username={item.username}
            thumbnail_url={item.thumbnail_url}
        />
    );

    const getActiveData = (): Content[] => {
        switch (activeTab) {
            case 'likes':
                return likedPosts || [];
            case 'saves':
                return savedPosts || [];
            case 'content':
                return userContent || [];
            default:
                return [];
        }
    };

    const isLoading = likesLoading || savesLoading || contentLoading;
    const error = likesError || savesError || contentError;

    if (!currentUser) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <MaterialCommunityIcons name="account-alert" size={48} color="#9ca3af" />
                <Text className="text-lg text-gray-600 mt-4">Please log in to view your content.</Text>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-gray-600 mt-4">Loading user data...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
                <Text className="text-lg text-red-600 mt-4">Error: {error.message}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            {/* Tab Buttons with bottom border indicator */}
            <View className="flex-row border-b border-gray-200">
                <TouchableOpacity 
                    onPress={() => setActiveTab('content')} 
                    className={`flex-1 py-3 ${activeTab === 'content' ? 'border-b-2 border-orange-500' : ''}`}
                >
                    <Text className={`text-center ${activeTab === 'content' ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}>
                        Content
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('likes')} 
                    className={`flex-1 py-3 ${activeTab === 'likes' ? 'border-b-2 border-orange-500' : ''}`}
                >
                    <Text className={`text-center ${activeTab === 'likes' ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}>
                        Likes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setActiveTab('saves')} 
                    className={`flex-1 py-3 ${activeTab === 'saves' ? 'border-b-2 border-orange-500' : ''}`}
                >
                    <Text className={`text-center ${activeTab === 'saves' ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}>
                        Saves
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View className="flex-1 bg-white">
                {getActiveData().length === 0 ? (
                    <View className="flex-1 justify-center items-center p-8">
                        <MaterialCommunityIcons 
                            name={activeTab === 'content' ? 'video-off-outline' : activeTab === 'likes' ? 'heart-off-outline' : 'bookmark-off-outline'} 
                            size={48} 
                            color="#9ca3af"
                        />
                        <Text className="text-gray-500 text-center mt-4 text-lg">
                            No {activeTab} to show yet
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={getActiveData()}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 4 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}