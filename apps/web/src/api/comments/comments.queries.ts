import { useQuery } from '@tanstack/react-query';
import { commentsKeys } from './comments.keys';
import { api } from '@/lib/api';
import type { Comment } from './comments.types';

export function useComments(taskId: string) {
  return useQuery<Comment[]>({
    queryKey: commentsKeys.list(taskId),
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${taskId}/comments`);
      return data;
    },
    enabled: !!taskId,
  });
}

export function useComment(taskId: string, id: string) {
  return useQuery<Comment>({
    queryKey: commentsKeys.detail(taskId, id),
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${taskId}/comments/${id}`);
      return data;
    },
    enabled: !!taskId && !!id,
  });
}
