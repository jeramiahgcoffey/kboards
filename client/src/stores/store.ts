import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

import { Store } from './store-interface';

export const useStore = defineStore('main', {
  state: (): Store => ({
    boards: [],
    darkMode: false,
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
    async fetchBoards() {
      const {
        data: { boards },
      } = await api.get('/boards');
      this.boards = boards;
      this.selectedBoard = boards[0];
    },
  },
});