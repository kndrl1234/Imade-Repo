import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../providers/AuthProvider'
import { useLikedPosts } from '../../api/UserData/likes';
import { useSavedPosts } from '../../api/UserData/saves';
import { useAuthenticatedUserContent } from '../../api/UserData/content';
import { supabase } from '../../utils/supabase';
import ContentItem from './ContentItem';
import { Content } from 'providers/types';

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
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-600">Please log in to view your content.</Text>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading user data...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-lg text-red-600">Error: {error.message}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-row justify-around mb-4">
                <TouchableOpacity onPress={() => setActiveTab('likes')} className={`px-4 py-2 rounded-lg ${activeTab === 'likes' ? 'bg-blue-500' : ''}`}>
                    <Text className={`${activeTab === 'likes' ? 'text-white' : 'text-black'}`}>Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('saves')} className={`px-4 py-2 rounded-lg ${activeTab === 'saves' ? 'bg-blue-500' : ''}`}>
                    <Text className={`${activeTab === 'saves' ? 'text-white' : 'text-black'}`}>Saves</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg ${activeTab === 'content' ? 'bg-blue-500' : ''}`}>
                    <Text className={`${activeTab === 'content' ? 'text-white' : 'text-black'}`}>Content</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-1 bg-gray-100">
                {getActiveData().length === 0 ? (
                    <Text className="text-lg text-gray-600 text-center mt-4">This user has no {activeTab} yet...</Text>
                ) : (
                    <FlatList
                        data={getActiveData()}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}