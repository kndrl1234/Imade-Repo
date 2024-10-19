import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Relation } from '~/providers/types';

export const useLikedPosts = (userId?: string): UseQueryResult<Relation[], Error> => {
  return useQuery({
    queryKey: ['likedPosts', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      try {
        const likes = await fetchLikes(userId);
        return likes;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const fetchLikes = async (userId: string): Promise<Relation[]> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      throw new Error(`Error fetching likes: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    throw error;
  }
};