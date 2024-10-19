import React, { useState } from 'react';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Comment from "components/content/Comment";
import { useComments, useCommentMutation } from "api/Content/Comment";
import { useAuth } from '~/providers/AuthProvider';
import { Comment as CommentType } from '~/providers/types';

const CommentSection = ({ postId }: { postId: string }) => {
  const { profile } = useAuth();
  const { data: comments, isLoading, error } = useComments(postId);
  const { createMutation } = useCommentMutation();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() && profile) {
      createMutation.mutate({
        comment: newComment,
        user_id: profile.id,
        post_id: postId,
        user: {
          username: profile.username,
          avatar_url: profile.avatar_url || '',
        },
      });
      setNewComment('');
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error loading comments</Text>;

  const renderComment = ({ item }: { item: CommentType }) => <Comment comment={item} />;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold">Comments ({comments?.length || 0})</Text>
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />

      <View className="flex-row items-center p-4 border-t border-gray-200">
        <Image
          source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/40' }}
          className="w-8 h-8 rounded-full mr-3"
        />
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Text className="text-blue-500 font-semibold">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;