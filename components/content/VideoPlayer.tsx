import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

interface VideoPlayerProps {
  uri: string;
  width: number;
  height: number;
}

export default function VideoPlayer({ uri, width, height }: VideoPlayerProps) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [error, setError] = useState<string | null>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
  };

  const onError = (error: string) => {
    console.error('Video playback error:', error);
    setError(error);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  return (
    <View style={{ width, height, backgroundColor: '#000' }}>
      {error ? (
        <Text style={{ color: 'white', textAlign: 'center' }}>Error: {error}</Text>
      ) : (
        <>
          <Video
            ref={videoRef}
            style={{ width: '100%', height: '100%' }}
            source={{ uri }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            onError={(error) => onError(error.error.message)}
          />
          {!status.isLoaded && (
            <ActivityIndicator 
              size="large" 
              color="white" 
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
            />
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={togglePlayPause}
          >
            {status.isLoaded && !status.isPlaying && (
              <AntDesign name="playcircleo" size={50} color="white" />
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}