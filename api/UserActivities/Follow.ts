import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Follow } from "providers/types";
import { useAuth } from 'providers/AuthProvider';

export const fetchFollowedUsers = async (followerId: string): Promise<Follow[]> => {
  const { data, error } = await supabase
    .from('followers')
    .select('followed_id')
    .eq('follower_id', followerId);

  if (error) throw error;
  return data;
};

export const useFollowedUsers = (): UseQueryResult<Follow[], Error> => {
  const { session } = useAuth();
  const followerId = session?.user.id;

  return useQuery({
    queryKey: ['followedUsers', followerId],
    queryFn: () => fetchFollowedUsers(followerId as string),
    enabled: !!followerId, // Only run the query if followerId is provided
  });
};

export const followUser = async (followerId: string, followedId: string): Promise<Follow> => {
  const { data, error } = await supabase
    .from('followers')
    .insert({ follower_id: followerId, followed_id: followedId })
    .single();

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followerId: string, followedId: string): Promise<void> => {
  const { error } = await supabase
    .from('followers')
    .delete()
    .match({ follower_id: followerId, followed_id: followedId });

  if (error) throw error;
};

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: ({ followerId, followedId }: { followerId: string; followedId: string }) => 
      followUser(followerId, followedId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['followers', variables.followedId]);
      queryClient.invalidateQueries(['following', variables.followerId]);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: ({ followerId, followedId }: { followerId: string; followedId: string }) => 
      unfollowUser(followerId, followedId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['followers', variables.followedId]);
      queryClient.invalidateQueries(['following', variables.followerId]);
    },
  });

  return { followMutation, unfollowMutation };
};