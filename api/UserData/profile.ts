import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Profile } from "providers/types"

export const updateAuthenticatedProfile = async ({ userId, newProfileData }: { userId: string, newProfileData: Partial<Profile> }): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(newProfileData)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export function useUpdateAuthenticatedProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAuthenticatedProfile,
    onSuccess: (updatedProfile, variables) => {
      queryClient.setQueryData(['profile', variables.userId], updatedProfile);
      queryClient.invalidateQueries(['profile', variables.userId]);
    },
  });
}

export const fetchUserProfile = async (username: string): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, description, follower_number, following_number, save_number, like_number, share_number')
      .eq('username', username)
      .single();

    if (error) {
      throw new Error(`Error fetching user profile: ${error.message}`);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const useUserProfile = (username?: string): UseQueryResult<Profile, Error> => {
  return useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => fetchUserProfile(username as string),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};