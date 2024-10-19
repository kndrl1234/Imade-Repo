import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Comment as CommentType } from '~/providers/types';
import { useCommentMutation } from "api/Content/Comment";
import { useAuth } from '~/providers/AuthProvider';
import { Link } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Comment({ comment }: { comment: CommentType }) {
  const { profile } = useAuth();
  const { deleteMutation } = useCommentMutation();
  const [isLiked, setIsLiked] = useState(false);

  const handleDelete = () => {
    if (profile?.id === comment.user_id) {
      deleteMutation.mutate(comment.id);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to update the like status
  };

  return (
    <View className="flex-row p-4 border-b border-gray-100">
      <Link href={{
        pathname: '/(user)/[user]',
        params: { user: comment.user.username },
      }} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: comment.user.avatar_url || 'https://via.placeholder.com/40' }}
            className="w-10 h-10 rounded-full mr-3"
          />
        </TouchableOpacity>
      </Link>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Link href={{
            pathname: '/(user)/[user]',
            params: { user: comment.user.username },
          }} asChild>
            <TouchableOpacity>
              <Text className="font-semibold mr-2">{comment.user.username}</Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-gray-500 text-xs">{new Date(comment.created_at).toLocaleString()}</Text>
        </View>
        <Text className="mt-1">{comment.comment}</Text>
        <View className="flex-row mt-2">
          <Text className="text-gray-500 text-xs mr-4">5 likes</Text>
          <Text className="text-gray-500 text-xs mr-4">Reply</Text>
          {profile?.id === comment.user_id && (
            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-red-500 text-xs">Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity 
        onPress={handleLike} 
        className="justify-center items-center w-8 h-8 bg-transparent"
      >
        <AntDesign name={isLiked ? "heart" : "hearto"} size={22} color={isLiked ? "orange" : "#333"} />
      </TouchableOpacity>
    </View>
  );
}