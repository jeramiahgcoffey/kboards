import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore("main", {
  state: () => {
    return {
      boards: [],
      selectedBoard: {},
      appModalOpen: false,
      newBoard: {},
    };
  },
  getters: {
    columns() {
      return this.selectedBoard.columns;
    },
    isDialogOpen() {
      return this.appModalOpen;
    },
  },
  actions: {
    async fetchBoards() {
      return await axios
        .get("http://127.0.0.1:5001/api/v1/boards")
        .then((res) => {
          this.boards = res.data.boards;
          this.selectedBoard = this.boards[0];
        })
        .catch((e) => console.log(e));
    },

    async createBoard() {
      return await axios
        .post("http://127.0.0.1:5001/api/v1/boards", this.newBoard)
        .then((res) => {
          const { board } = res.data;
          this.boards.push(board);
          this.selectedBoard = board;
          this.newBoard = {};
        })
        .catch((e) => console.log(e));
    },

    setSelectedBoard(board) {
      this.selectedBoard = board;
    },
  },
});
