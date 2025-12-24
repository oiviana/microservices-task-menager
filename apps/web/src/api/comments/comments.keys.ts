export const commentsKeys = {
  all: ['comments'] as const,
  list: (taskId: string) => [...commentsKeys.all, taskId] as const,
  detail: (taskId: string, id: string) =>
    [...commentsKeys.all, taskId, id] as const,
};