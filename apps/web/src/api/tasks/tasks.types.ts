export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'done';
  createdAt: string;
  updatedAt: string;
}
