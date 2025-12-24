import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsKeys } from './comments.keys';
import type { Comment } from './comments.types';
import { api } from '@/lib/api';

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { content: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/tasks/${taskId}/comments`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(taskId),
      });
    },
  });
}

export function useUpdateComment(taskId: string, id: string) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { content: string }>({
    mutationFn: async (payload) => {
      const { data } = await api.put(
        `/tasks/${taskId}/comments/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(taskId),
      });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${taskId}/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(taskId),
      });
    },
  });
}
