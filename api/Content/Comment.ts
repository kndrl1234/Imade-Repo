import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from 'utils/supabase';
import { Comment } from "providers/types";

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comment')
    .select(`
      *,
      user:profiles!user_id (username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const useComments = (postId: string): UseQueryResult<Comment[], Error> => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    staleTime: 1 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

export const createComment = async (newComment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comment')
    .insert(newComment)
    .single();

  if (error) throw error;
  return data;
};

export const updateComment = async ({ id, comment }: { id: string, comment: string }): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comment')
    .update({ comment })
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('comment')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const useCommentMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(['comments', newComment.post_id], (oldComments = []) => [newComment, ...oldComments]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      queryClient.setQueryData<Comment[]>(['comments', updatedComment.post_id], (oldComments = []) => 
        oldComments.map(comment => comment.id === updatedComment.id ? updatedComment : comment)
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, deletedCommentId) => {
      queryClient.setQueryData<Comment[]>(['comments'], (oldComments = []) => 
        oldComments.filter(comment => comment.id !== deletedCommentId)
      );
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};