import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Content } from '~/providers/types';

export const fetchUserContent = async (userId: string): Promise<Content[]> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching user content: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const useUserContent = (userId?: string): UseQueryResult<Content[], Error> => {
  return useQuery({
    queryKey: ['userContent', userId],
    queryFn: () => fetchUserContent(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const useAuthenticatedUserContent = (userId?: string): UseQueryResult<Content[], Error> => {
  return useQuery({
    queryKey: ['userContent', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      try {
        const content = await fetchAuthenticatedUserContent(userId);
        return content;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });
};

export const fetchAuthenticatedUserContent = async (userId: string): Promise<Content[]> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error fetching user content: ${error.message}`);
    }
    return data || [];
  } catch (error) {
    throw error;
  }
};