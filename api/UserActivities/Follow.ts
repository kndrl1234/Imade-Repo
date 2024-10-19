import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Follow } from "providers/types";

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