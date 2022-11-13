export interface Status {
  name: string,
  color: string,
  _id: string,
}

export interface Subtask {
  readonly _id: string;
  title: string;
  completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Task {
  readonly _id: string;
  title: string;
  description?: string;
  status: Status;
  subtasks: [];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Column {
  readonly _id: string;
  name: string;
  color: string;
}

export interface Board {
  readonly _id: string;
  name: string;
  description?: string;
  readonly createdBy: string;
  columns: {
    name: string;
    color?: string;
    readonly _id: string;
  }[];
  tasks: Task[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly __v: number;
}

export interface Store {
  awaitingResponse: boolean;
  boards: Board[];
  dialogContent: string;
  dialogOpen: boolean;
  draftTask: {
    _id: string;
    title: string;
    description?: string;
    status: Status;
    subtasks: string[];
  };
  draftColumn: {
    _id: string;
    name: string;
    color: string;
  };
  newTask: {
    title: string;
    description?: string;
    status: string;
    subtasks: string[];
  };
  selectedBoard?: Board;
}
