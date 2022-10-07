import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

import { Store } from './store-interface';

export const useStore = defineStore('main', {
  state: (): Store => ({
    boards: [],
    selectedBoard: undefined,
  }),

  getters: {
    columns: (state) => state.selectedBoard?.columns,
    boards: (state) => state.boards,
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
