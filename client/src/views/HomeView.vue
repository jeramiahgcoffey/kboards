<template>
  <main>
    <div class="flex h-screen">
      <div class="flex flex-col flex-shrink-0">
        <app-sidebar
          :boards="boardNames"
          :selected-board="selectedBoard.name"
        />
      </div>
      <div class="flex flex-col flex-grow h-full min-w-0">
        <app-header :title="selectedBoard.name" />

        <div class="flex-grow-1 overflow-auto h-screen">
          <app-body :board="selectedBoard" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import AppHeader from "../components/Layout/AppHeader.vue";
import AppBody from "../components/Layout/AppBody.vue";
import AppSidebar from "../components/Layout/AppSidebar.vue";

import axios from "axios";
import { useStore } from "../stores/store";
import { mapActions, mapState } from "pinia";

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppBody,
  },

  data() {
    return {
      boards: [],
      selectedBoard: {},
    };
  },

  async created() {
    await this.fetchBoards();
    console.log(this.stateBoards);
    // await axios
    //   .get("http://127.0.0.1:5001/api/v1/boards")
    //   .then((res) => {
    //     this.boards = res.data.boards;
    //     this.selectedBoard = this.boards[0];
    //   })
    //   .catch((e) => console.log(e));
  },

  computed: {
    boardNames() {
      return this.boards.map((b) => b.name);
    },
    ...mapState(useStore, {
      boards: "boards",
      selectedBoard: "selected",
    }),
  },

  methods: {
    ...mapActions(useStore, ["fetchBoards"]),
  },
};
</script>
