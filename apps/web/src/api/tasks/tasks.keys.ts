export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (filters: unknown) => [...tasksKeys.lists(), filters] as const,
  detail: (id: string) => [...tasksKeys.all, 'detail', id] as const,
};
