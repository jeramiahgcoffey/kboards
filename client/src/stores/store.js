import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore("main", {
  state: () => {
    return {
      boards: [],
      selectedBoard: {},
    };
  },
  getters: {
    columns() {
      return this.selectedBoard.columns;
    },
  },
  actions: {
    async fetchBoards() {
      return await axios
        .get("http://127.0.0.1:5001/api/v1/boards")
        .then((res) => {
          this.boards = res.data.boards;
          this.selectedBoard = this.boards[0];
          console.log(this.selectedBoard);
        })
        .catch((e) => console.log(e));
    },

    setSelectedBoard(board) {
      this.selectedBoard = board;
    },
  },
});
