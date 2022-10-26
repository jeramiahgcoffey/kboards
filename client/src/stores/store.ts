import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify, Loading } from 'quasar';

import { Store, Board, Column, Task, Subtask } from './models';
import { handleError } from 'src/common/handleError';

export const useStore = defineStore('main', {
  state: (): Store => ({
    awaitingResponse: false,
    boards: [],
    dialogContent: '',
    dialogOpen: false,
    draftTask: {
      _id: '',
      title: '',
      description: '',
      status: '',
      subtasks: [],
    },
    draftColumn: {
      _id: '',
      name: '',
      color: '',
    },
    newTask: { title: '', description: '', status: '', subtasks: [] },
    selectedBoard: undefined,
  }),

  getters: {
    columns: (state) => state.selectedBoard?.columns,
    columnNames: (state) => state.selectedBoard?.columns.map((c) => c.name),
    columnNamesCapitalized: (state) =>
      state.selectedBoard?.columns.map((c) =>
        c.name
          .toLowerCase()
          .split(' ')
          .map((word) => word.replace(word[0], word[0]?.toUpperCase()))
          .join(' ')
      ),
    tasksByColumn: (state) => (columnName: string) =>
      state.selectedBoard?.tasks.filter((task) => task.status === columnName),
  },

  actions: {
    async createBoard(payload: { name: string; description?: string }) {
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.post('/boards', payload);
        this.boards.push(board);
        this.selectBoard(board);
        this.success('Board created successfully!');
        this.dialogOpen = false;
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async createColumn(payload: { name: string; color?: string }) {
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.post(
          `/boards/${this.selectedBoard?._id}/columns`,
          payload
        );
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
        this.success('Column created successfully');
        this.dialogOpen = false;
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async createTask() {
      const subtasks = this.newTask.subtasks.filter((task) => task); // Filter out empty tasks
      const payload = {
        title: this.newTask.title,
        description: this.newTask.description,
        status: this.newTask.status,
        subtasks,
      };
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.post(`/boards/${this.selectedBoard?._id}/tasks`, payload);
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
        this.success('Task created successfully');
        this.dialogOpen = false;
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async updateTask() {
      const subtasks = this.draftTask.subtasks.filter((task) => task); // Filter out empty tasks
      const payload = {
        task: {
          title: this.draftTask.title,
          description: this.draftTask.description,
          status: this.draftTask.status,
          subtasks,
        },
      };
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.patch(`/boards/tasks/${this.draftTask._id}`, payload);
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
        this.success('Task saved successfully');
        this.dialogOpen = false;
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async updateColumn() {
      const payload = {
        name: this.draftColumn.name,
        color: this.draftColumn.color,
      };
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.patch(
          `/boards/${this.selectedBoard?._id}/columns/${this.draftColumn._id}`,
          payload
        );
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
        this.success('Column saved successfully');
        this.dialogOpen = false;
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async fetchBoards() {
      try {
        Loading.show();
        const {
          data: { boards },
        } = await api.get('/boards');
        this.boards = boards;
        this.selectBoard(boards[0]);
      } catch (error) {
        handleError(error);
      } finally {
        Loading.hide();
      }
    },

    async toggleSubtaskCompletion(taskId: string, subtask: Subtask) {
      const payload = {
        subtask: { ...subtask, completed: !subtask.completed },
      };
      try {
        Loading.show();
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.patch(
          `/boards/tasks/${taskId}/subtasks/${subtask._id}`,
          payload
        );
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
      } catch (error) {
        handleError(error);
      } finally {
        Loading.hide();
        this.awaitingResponse = false;
      }
    },
    async addSubtask() {
      const subtasks = this.draftTask.subtasks
        .filter((task) => task)
        .concat('New Subtask');
      const payload = {
        task: {
          title: this.draftTask.title,
          description: this.draftTask.description,
          status: this.draftTask.status,
          subtasks,
        },
      };
      try {
        this.awaitingResponse = true;
        const taskId = this.draftTask._id;
        const {
          data: { board },
        } = await api.patch(`/boards/tasks/${taskId}`, payload);
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            this.loadDraftTask(board.tasks.find((t: Task) => t._id === taskId));
            return board;
          } else {
            return b;
          }
        });
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async deleteTask(taskId: string) {
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.delete(`/boards/tasks/${taskId}`);
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    async deleteColumn(columnId: string) {
      try {
        this.awaitingResponse = true;
        const {
          data: { board },
        } = await api.delete(
          `/boards/${this.selectedBoard?._id}/columns/${columnId}`
        );
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectBoard(board);
            return board;
          } else {
            return b;
          }
        });
      } catch (error) {
        handleError(error);
      } finally {
        this.awaitingResponse = false;
      }
    },

    selectBoard(board: Board) {
      this.newTask = {
        title: '',
        description: '',
        status: '',
        subtasks: [],
      };
      this.draftTask = {
        _id: '',
        title: '',
        description: '',
        status: '',
        subtasks: [],
      };
      this.selectedBoard = board;
    },

    loadDraftTask(task: Task) {
      this.draftTask = {
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        subtasks: task.subtasks,
      };
    },

    loadDraftColumn(column: Column) {
      this.draftColumn = {
        _id: column._id,
        name: column.name,
        color: column.color,
      };
    },

    notify(type: string, message: string) {
      Notify.create({
        message,
        type,
      });
    },

    error(message: string) {
      this.notify('negative', message);
    },

    success(message: string) {
      this.notify('positive', message);
    },
  },
});
