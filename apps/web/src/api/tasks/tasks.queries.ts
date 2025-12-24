import { useQuery } from '@tanstack/react-query';
import { tasksKeys } from './tasks.keys';
import type { Task } from './tasks.types';
import { api } from '@/lib/api';

export function useTasks(filters?: {
  search?: string;
  status?: string;
}) {
  return useQuery<Task[]>({
    queryKey: tasksKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/tasks', { params: filters });
      return data;
    },
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: tasksKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
