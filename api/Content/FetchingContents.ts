import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Content, Follow } from "providers/types";
import { useAuth } from 'providers/AuthProvider';
import { fetchFollowedUsers } from "../UserActivities/Follow"; // Import your follow API function

// Function to fetch posts from followed users
export const fetchFollowedUsersPosts = async (followerId: string): Promise<Content[]> => {
    const followedUsers: Follow[] = await fetchFollowedUsers(followerId);
    const followedUserIds = followedUsers.map(user => user.followed_id);
  
    if (followedUserIds.length === 0) return []; // Return empty if no followed users
  
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .in('user_id', followedUserIds);
  
    if (error) throw error;
    return data;
  };

// React Query hook to fetch followed users' posts
export const useFollowedUsersPosts = (): UseQueryResult<Content[], Error> => {
  const { session } = useAuth();
  const followerId = session?.user?.id;

  return useQuery({
    queryKey: ['followedUsersPosts', followerId],
    queryFn: () => fetchFollowedUsersPosts(followerId as string),
    enabled: !!followerId, // Only run the query if followerId is available
  });
};


// Function to fetch explore posts (posts from users not followed by the authenticated user)
export const fetchExplorePosts = async (followerId: string): Promise<Content[]> => {
    const followedUsers: Follow[] = await fetchFollowedUsers(followerId);
    const followedUserIds = followedUsers.map(user => user.followed_id);
  
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .not('user_id', 'in', followedUserIds.length > 0 ? followedUserIds : ['']); // Handle empty array
  
    if (error) throw error;
    return data;
  };
  
  // React Query hook to fetch posts for the Explore page
  export const useExplorePosts = (): UseQueryResult<Content[], Error> => {
    const { session } = useAuth();
    const followerId = session?.user?.id;
  
    return useQuery({
      queryKey: ['explorePosts', followerId],
      queryFn: () => fetchExplorePosts(followerId as string),
      enabled: !!followerId, // Only run the query if followerId is available
    });
  };