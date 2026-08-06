export interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  completed: boolean;
  category?: string;
}
