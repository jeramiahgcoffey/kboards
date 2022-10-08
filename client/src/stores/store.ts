import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

import { Store } from './store-interface';

export const useStore = defineStore('main', {
  state: (): Store => ({
    boards: [],
    dialogContent: '',
    dialogOpen: false,
    selectedBoard: undefined,
  }),

  getters: {
    columns: (state) => state.selectedBoard?.columns,
    tasksByColumn: (state) => (column: string) =>
      state.selectedBoard?.tasks.filter((task) => task.status === column),
  },

  actions: {
    async createBoard(payload: { name: string; description?: string }) {
      try {
        const {
          data: { board },
        } = await api.post('/boards', payload);
        this.boards.push(board);
        this.success('Board created successfully!');
      } catch (error) {
        this.error(String(error));
      }
    },

    async createColumn(payload: { name: string }) {
      try {
        const {
          data: { board },
        } = await api.post(
          `/boards/${this.selectedBoard?._id}/column`,
          payload
        );
        this.boards = this.boards.map((b) => {
          if (b._id === this.selectedBoard?._id) {
            this.selectedBoard = board;
            return board;
          } else {
            return b;
          }
        });
        this.success('Column created successfully!');
      } catch (error) {
        this.error(String(error));
      }
    },

    async fetchBoards() {
      try {
        const {
          data: { boards },
        } = await api.get('/boards');
        this.boards = boards;
        this.selectedBoard = boards[0];
      } catch (error) {
        this.error(String(error));
      }
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
