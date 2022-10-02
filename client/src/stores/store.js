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
      newTask: {
        title: "",
        description: "",
      },
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
      try {
        const res = await axios.get("http://127.0.0.1:5001/api/v1/boards");
        this.boards = res.data.boards;
        this.selectedBoard = this.boards[0];
      } catch (error) {
        console.log(error);
      }
    },

    async createBoard() {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5001/api/v1/boards",
          this.newBoard
        );
        const { board } = res.data;
        this.boards.push(board);
        this.selectedBoard = board;
        this.newBoard = {};
      } catch (error) {
        console.log(error);
      }
    },

    async createColumn() {
      try {
        const res = await axios.post(
          `http://127.0.0.1:5001/api/v1/boards/${this.selectedBoard._id}/column`,
          { name: this.newColumn }
        );
        const { board: updatedBoard } = res.data;
        this.boards = this.boards.map((board) => {
          if (board._id === updatedBoard._id) {
            return updatedBoard;
          }
          return board;
        });
        this.selectedBoard = updatedBoard;
        this.newColumn = "";
      } catch (error) {
        console.log(error);
      }
    },

    async createTask() {
      try {
        const res = await axios.post(
          `http://localhost:5001/api/v1/boards/${this.selectedBoard._id}/task`,
          this.newTask
        );
        const { board: updatedBoard } = res.data;
        this.boards = this.boards.map((board) => {
          if (board._id === updatedBoard._id) {
            return updatedBoard;
          }
          return board;
        });
        this.selectedBoard = updatedBoard;
        this.newTask = {
          title: "",
          description: "",
        };
      } catch (error) {
        console.log(error);
      }
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
