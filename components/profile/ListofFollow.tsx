import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';

// Mock data for testing UI
const mockFollowers = [
  { id: '1', username: 'john_doe', fullName: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?img=1', isFollowing: false },
  { id: '2', username: 'jane_smith', fullName: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', isFollowing: true },
  { id: '3', username: 'bob_johnson', fullName: 'Bob Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=3', isFollowing: false },
  { id: '4', username: 'alice_wonder', fullName: 'Alice Wonder', avatarUrl: 'https://i.pravatar.cc/150?img=4', isFollowing: true },
  { id: '5', username: 'charlie_brown', fullName: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?img=5', isFollowing: false },
];

function FollowerItem({ follower, onToggleFollow }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center">
        <Image
          source={{ uri: follower.avatarUrl }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="font-semibold">{follower.username}</Text>
          <Text className="text-gray-500">{follower.fullName}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onToggleFollow(follower.id)}
        className={`px-4 py-1 rounded-md ${follower.isFollowing ? 'border border-gray-300' : 'bg-blue-500'}`}
      >
        <Text className={`font-semibold ${follower.isFollowing ? 'text-black' : 'text-white'}`}>
          {follower.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ListofFollow() {
  const [followers, setFollowers] = useState(mockFollowers);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleFollow = (id) => {
    setFollowers(followers.map(follower => 
      follower.id === id ? { ...follower, isFollowing: !follower.isFollowing } : follower
    ));
  };

  const filteredFollowers = followers.filter(follower => 
    follower.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    follower.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <TextInput
          className="bg-gray-100 px-4 py-2 rounded-md"
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFollowers}
        renderItem={({ item }) => <FollowerItem follower={item} onToggleFollow={handleToggleFollow} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

export default ListofFollow;