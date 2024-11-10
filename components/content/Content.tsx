import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Link } from 'expo-router';
import CommentSection from "components/content/CommentSection";
import VideoPlayer from 'components/content/VideoPlayer';
import ContentButtonLine from 'components/content/ContentButtonLine';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';
import { Content as ContentType } from '~/providers/types';
import { useLikePost, useUnlikePost, useSavePost, useUnsavePost } from '~/api/UserActivities/Like&Save';
import { useFollowMutation } from '~/api/UserActivities/Follow';

type ContentProps = Pick<ContentType, 'user_id'| 'id' | 'username' | 'description' | 'video' | 'like_number' | 'title' | 'user'>;

export default function Content({id, user_id, username, description, video, like_number, title, user }: ContentProps) {
  const screenWidth = Dimensions.get('window').width;
  const [isModalVisible, setModalVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(like_number);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const SAMPLE_VIDEO_URL = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
  const { session, profile } = useAuth();
  const router = useRouter();

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();
  const { followMutation } = useFollowMutation();

  const toggleModal = () => setModalVisible(!isModalVisible);
  
  const handleFollow = () => {
    if (!session || !profile) {
      router.push('/login');
      return;
    }

    followMutation.mutate(
      { followerId: profile.id, followedId: user_id },
      {
        onSuccess: () => {
          // Handle successful follow
          console.log('Successfully followed user');
        },
        onError: (error) => {
          console.error('Error following user:', error);
        }
      }
    );
  };

  const handleLike = () => {
    if (!session || !profile) {
      router.push('/login');
      return;
    }

    const mutation = isLiked ? unlikePost : likePost;
    mutation.mutate({ user_id: profile.id, post_id: id }, {
      onSuccess: () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      },
      onError: (error) => {
        console.error('Error liking/unliking post:', error);
      }
    });
  };

  const handleSave = () => {
    if (!session || !profile) {
      router.push('/login');
      return;
    }

    const mutation = isSaved ? unsavePost : savePost;
    mutation.mutate({ user_id: profile.id, post_id: id }, {
      onSuccess: () => {
        setIsSaved(!isSaved);
      },
      onError: (error) => {
        console.error('Error saving/unsaving post:', error);
      }
    });
  };

  // Use the provided video URL if it exists, otherwise use the sample URL
  const videoUrl = video && video.trim() !== '' ? video : SAMPLE_VIDEO_URL;

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row justify-between items-center p-3">
        <Link href={{
          pathname: '/(user)/[user]',
          params: { user: username },
        }} asChild>
          <TouchableOpacity className="flex-row items-center">
            <Image 
              source={{ uri: user.avatar_url || 'https://via.placeholder.com/40' }} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <Text className="text-base font-medium">{username}</Text>
          </TouchableOpacity>
        </Link>
        {profile?.id !== user.id && (
          <TouchableOpacity 
            className="py-1.5 px-4 rounded-md bg-orange-500"
            onPress={handleFollow}
          >
            <Text className="text-sm font-semibold text-white">
              Follow
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <VideoPlayer 
        uri={videoUrl} 
        width={screenWidth} 
        height={(screenWidth * 9) / 16} 
      />
      <Text className="text-black-700 text-lg font-semibold pl-3 p-1">{title}</Text>
      <Text className="text-gray-700 text-sm p-2">{description}</Text>

      <ContentButtonLine
        likeCount={likeCount}
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={handleLike}
        onSave={handleSave}
        onComment={toggleModal}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View className="flex-1 bg-white">
          <CommentSection postId={id} />
          <TouchableOpacity onPress={toggleModal} className="p-4 bg-gray-100">
            <Text className="text-center text-blue-500 font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}