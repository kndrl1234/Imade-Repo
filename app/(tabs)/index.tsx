import React, { useState, useCallback } from 'react';
import { SafeAreaView, FlatList, Text, ActivityIndicator, View, RefreshControl } from 'react-native';
import TopBar from '~/components/index/TopBar';
import Content from '~/components/content/Content';
import ButtonLine from '~/components/index/ButtonLine';
import { useContentData } from '~/api/Content/FetchAllContent';
import { useAuth } from 'providers/AuthProvider';
import { Content as ContentType } from 'providers/types';

const ContentListItem: React.FC<{ item: ContentType; index: number }> = ({ item, index }) => (
  <>
    {index === 0 && <ButtonLine />}
    <Content 
      id={item.id} 
      username={item.username} 
      description={item.description} 
      video={item.video} 
      like_number={item.like_number} 
      title={item.title}
      user={item.user}
      user_id={item.user_id}
    />
  </>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('explore');
  const { data, isLoading, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useContentData();
  const { session } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); // Fetch the next page data
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>An error occurred: {error.message}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!data || data.pages[0].length === 0) {
    if (activeTab === 'forYou') {
      return (
        <SafeAreaView className="flex-1">
          <TopBar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
          <View className="flex-1 justify-center items-center">
            <Text className="text-center px-4">
              Follow creators for a more personalized experience.
            </Text>
          </View>
        </SafeAreaView>
      );
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <TopBar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      <Text className="text-center p-2 bg-gray-200">
        {session ? `Authenticated as: ${session.user.email}` : 'Not authenticated'}
      </Text>
      <FlatList<ContentType>
        data={data.pages.flat()} // Flatten the pages array to a single array for FlatList
        renderItem={({ item, index }) => <ContentListItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff6f00", "#ff6f00"]} // Android
            tintColor="#689F38" // iOS
            title="Pull to refresh..." // iOS
            titleColor="#00ff00" // iOS
          />
        }
        onEndReached={loadMore} // Trigger pagination when reaching the end
        onEndReachedThreshold={0.5} // Load more when 50% of the list is reached
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="large" /> : null} // Show a loading indicator when fetching more
      />
    </SafeAreaView>
  );
}