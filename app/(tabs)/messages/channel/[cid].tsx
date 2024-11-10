import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Channel as ChannelType, StreamChat } from 'stream-chat';
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";



export default function ChannelScreen() {
  const { cid } = useLocalSearchParams<{cid: string}>();
  const [channel, setChannel] = useState<ChannelType | null>(null);

  const { client} = useChatContext()

  useEffect(() => {
    const fetchChannel = async () => {
      const channel = await client.queryChannels({cid});
      setChannel(channel[0]);
    }
    fetchChannel()
  }, [cid])

  if(!channel){
    return <ActivityIndicator />
  }
  return (
    <Channel channel={channel}>
        <MessageList></MessageList>
        <MessageInput></MessageInput>
    </Channel>
  )
}