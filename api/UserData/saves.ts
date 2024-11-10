import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Relation } from '~/providers/types';

export const useSavedPosts = (userId?: string): UseQueryResult<Relation[], Error> => {
  return useQuery({
    queryKey: ['savedPosts', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      try {
        const saves = await fetchSaves(userId);
        return saves;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const fetchSaves = async (userId: string): Promise<Relation[]> => {
  try {
    const { data, error } = await supabase
      .from('saves')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching saves: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    throw error;
  }
};