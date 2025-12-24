import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksKeys } from './tasks.keys';
import type { Task } from './tasks.types';
import { api } from '@/lib/api';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Partial<Task>>({
    mutationFn: async (payload) => {
      const { data } = await api.post('/tasks', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Partial<Task>>({
    mutationFn: async (payload) => {
      const { data } = await api.put(`/tasks/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });
}
