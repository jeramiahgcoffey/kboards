import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore("main", {
  state: () => {
    return {
      appModalOpen: false,
      boards: [],
      dialogContentName: "",
      newBoard: {},
      newColumn: "",
      selectedBoard: {},
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

    async createColumn() {
      return await axios
        .post(
          `http://127.0.0.1:5001/api/v1/boards/${this.selectedBoard._id}/column`,
          { name: this.newColumn }
        )
        .then((res) => {
          const { board: updatedBoard } = res.data;
          this.boards = this.boards.map((board) => {
            if (board._id === updatedBoard._id) {
              return updatedBoard;
            }
            return board;
          });
          this.selectedBoard = updatedBoard;
          this.newColumn = "";
        })
        .catch((e) => console.log(e, "here"));
    },

    closeAppModal() {
      this.appModalOpen = false;
      this.dialogContentName = "";
    },

    openAppModal(dialogContentName) {
      this.dialogContentName = dialogContentName;
      this.appModalOpen = true;
    },

    setSelectedBoard(board) {
      this.selectedBoard = board;
    },
  },
});
