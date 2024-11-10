import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '~/utils/supabase';
import { Relation } from '~/providers/types';

type InteractionType = 'like' | 'save';

function usePostInteraction(type: InteractionType, isAdding: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, post_id }: Relation) => {
      const table = `${type}s`;
      const numberField = `${type}_number`;

      if (isAdding) {
        const { error: insertError } = await supabase
          .from(table)
          .insert({ user_id, post_id });

        if (insertError) throw insertError;
      } else {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .match({ user_id, post_id });

        if (deleteError) throw deleteError;
      }

      const { data, error: updateError } = await supabase
        .from('content')
        .update({ [numberField]: supabase.rpc(isAdding ? 'increment' : 'decrement', { x: 1 }) })
        .eq('id', post_id)
        .select();

      if (updateError) throw updateError;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['post', variables.post_id]);
      queryClient.invalidateQueries([`user${type.charAt(0).toUpperCase() + type.slice(1)}s`, variables.user_id]);
    },
  });
}

export function useLikePost() {
  return usePostInteraction('like', true);
}
export function useUnlikePost() {
  return usePostInteraction('like', false);
}
export function useSavePost() {
  return usePostInteraction('save', true);
}
export function useUnsavePost() {
  return usePostInteraction('save', false);
}