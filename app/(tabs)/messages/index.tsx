import { ChannelList } from 'stream-chat-expo';
import { router } from 'expo-router';
import { useAuth } from '../../../providers/AuthProvider';
import { View } from 'react-native';

export default function Messages() {
  const { profile } = useAuth();

  const filters = {
    members: { $in: [profile?.id] },
    type: 'messaging'
  };

  const sort = { last_message_at: -1 };

  return (
    <View style={{ flex: 1 }}>  
      <ChannelList 
        filters={filters}
        sort={sort}
        onSelect={(channel) => router.push(`/(tabs)/messages/channel/${channel.cid}`)}
      />
    </View>
  );
}