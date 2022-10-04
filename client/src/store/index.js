import { createAPIRequest } from "@/common/axios.config";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    boards: [],
    selectedBoard: {},
  },
  getters: {},
  mutations: {},
  actions: {
    fetchBoards: async () => {
      const { data } = await createAPIRequest().get("/boards");
      const { boards } = data;
      console.log(boards);
    },
  },
  modules: {},
});
