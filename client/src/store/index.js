import { createAPIRequest } from "@/common/axios.config";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    boards: [],
    selectedBoard: {},
  },
  getters: {
    getBoards: (state) => state.boards,
    getColumns: (state) => state.selectedBoard.columns,
    getSelectedBoard: (state) => state.selectedBoard,
  },
  mutations: {
    setBoards: (state, boards) => {
      state.boards = boards;
      state.selectedBoard = boards[0] || {};
    },
    setSelectedBoard: (state, board) => {
      state.selectedBoard = board;
    },
  },
  actions: {
    fetchBoards: async ({ commit }) => {
      const { data } = await createAPIRequest().get("/boards");
      commit("setBoards", data.boards);
    },
  },
  modules: {},
});
