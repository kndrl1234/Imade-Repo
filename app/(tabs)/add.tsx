import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { supabase } from '~/utils/supabase';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '~/providers/AuthProvider';
import * as VideoThumbnails from 'expo-video-thumbnails';

export default function ContentUpload() {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { session, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    console.log('Auth state changed:');
    console.log('Session:', session);
    console.log('Is loading:', isAuthLoading);
  }, [session, isAuthLoading]);

  const pickVideo = async () => {
    console.log('Picking video');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Video selected:', result.assets[0].uri);
      setVideo(result.assets[0].uri);
    } else {
      console.log('Video selection cancelled');
    }
  };

  const generateThumbnail = async (videoUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0,
      });
      return uri;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const uploadContent = async () => {
    console.log('uploadContent function called');
    console.log('Video state:', video);
    console.log('Session:', session);
    console.log('Is auth loading:', isAuthLoading);

    if (!video || !session || isAuthLoading) {
      console.log('No video, no session, or auth still loading. Aborting upload.');
      console.log('Video:', video);
      console.log('Session:', session);
      console.log('Is auth loading:', isAuthLoading);
      return;
    }

    setUploading(true);
    console.log('Starting content upload');

    try {
      // Upload video
      const videoExt = video.split('.').pop();
      const videoFileName = `${Date.now()}.${videoExt}`;
      const videoPath = `${videoFileName}`;

      console.log('Uploading video:', videoPath);
      let { error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoPath, {
          uri: video,
          type: `video/${videoExt}`,
          name: videoFileName,
        });

      if (videoUploadError) {
        console.error('Video upload error:', videoUploadError);
        throw videoUploadError;
      }

      console.log('Video uploaded successfully');
      const videoUrl = supabase.storage.from('videos').getPublicUrl(videoPath).data.publicUrl;
      console.log('Video URL:', videoUrl);

      // Generate and upload thumbnail
      console.log('Generating thumbnail');
      const thumbnailUri = await generateThumbnail(video);
      let thumbnailUrl = null;
      if (thumbnailUri) {
        const thumbnailExt = thumbnailUri.split('.').pop();
        const thumbnailFileName = `${Date.now()}.${thumbnailExt}`;
        const thumbnailPath = `${thumbnailFileName}`;

        console.log('Uploading thumbnail:', thumbnailPath);
        let { error: thumbnailUploadError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, {
            uri: thumbnailUri,
            type: `image/${thumbnailExt}`,
            name: thumbnailFileName,
          });

        if (thumbnailUploadError) {
          console.error('Thumbnail upload error:', thumbnailUploadError);
          throw thumbnailUploadError;
        }

        console.log('Thumbnail uploaded successfully');
        thumbnailUrl = supabase.storage.from('videos').getPublicUrl(thumbnailPath).data.publicUrl;
        console.log('Thumbnail URL:', thumbnailUrl);
      } else {
        console.log('Failed to generate thumbnail');
      }

      // Create content entry in database
      console.log('Creating content entry in database');
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .insert({
          title,
          description,
          username: session.user.user_metadata.username,
          user_id: session.user.id,
          video: videoUrl,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single();

      if (contentError) {
        console.error('Content creation error:', contentError);
        throw contentError;
      }

      console.log('Content created successfully:', contentData);
      alert('Content uploaded successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error in uploadContent:', error);
      alert('Error uploading content: ' + error.message);
    } finally {
      setUploading(false);
      console.log('Upload process completed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 pt-8">
        <View className="p-4 pt-8">
          <Text className="text-2xl font-bold mb-6 text-center">Share what you built!</Text>
          
          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-base font-semibold mb-2">Title</Text>
            <TextInput
              className="text-lg mb-4 pb-2 border-b border-gray-200"
              placeholder="Share what it is about..."
              value={title}
              onChangeText={setTitle}
            />

            <Text className="text-base font-semibold mb-2 mt-4">Description</Text>
            <TextInput
              className="text-base pb-2 border-b border-gray-200"
              placeholder="Tell us more..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View className="flex-row justify-evenly mt-6">
              <TouchableOpacity onPress={pickVideo} className="bg-orange-500 px-4 py-2 rounded-md flex-row items-center">
                <Feather name="video" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Upload Your Video</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={uploadContent}
                className="bg-orange-500 px-4 py-2 rounded-md"
                disabled={uploading || !video || isAuthLoading || !session}
              >
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Share</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {video && (
            <View className="mb-6 bg-white p-4 rounded-lg">
              <Video
                source={{ uri: video }}
                style={{ width: '100%', height: 200 }}
                useNativeControls
                resizeMode="contain"
              />
            </View>
          )}

          <Text className="text-gray-500 text-center mt-4 text-sm">
            By sharing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}