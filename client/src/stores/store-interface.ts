interface Task {
  readonly _id: string;
  title: string;
  status: string;
  subtasks: [];
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface Board {
  readonly _id: string;
  name: string;
  description?: string;
  readonly createdBy: string;
  columns: string[];
  tasks: Task[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly __v: number;
}

export interface Store {
  boards: Board[];
  darkMode: boolean;
  selectedBoard?: Board;
}
