import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Content } from "~/providers/types";

// Fetch content with pagination (starting with first 20)
export const fetchContent = async ({ pageParam = 1, limit = 20 }): Promise<Content[]> => {
  const offset = (pageParam - 1) * limit; // Calculate offset based on page and limit
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      user:profiles!user_id (avatar_url)
    `)
    .range(offset, offset + limit - 1) // Adjust range for pagination
    .order('created_at', { ascending: false }); // Order by created_at
  
  if (error) {
    throw new Error(error.message);
  }

  return data as Content[];
};

// Custom hook for fetching paginated content
export function useContentData() {
  const limit = 20; // Limit set to 20 items per page
  
  return useInfiniteQuery({
    queryKey: ['content'],
    queryFn: ({ pageParam }) => fetchContent({ pageParam, limit }), 
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === limit ? pages.length + 1 : undefined; // Determine the next page
    },
  });
}