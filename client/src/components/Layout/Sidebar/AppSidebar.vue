<script setup>
import { onMounted } from "vue";
import { useStore } from "../../../stores/store";
import SidebarLink from "./SidebarLink.vue";
import SidebarNewBoard from "./SidebarNewBoard.vue";

const store = useStore();

onMounted(() => {
  store.fetchBoards();
});
</script>

<template>
  <div class="w-72 h-full bg-gray-900 text-cyan-400 flex-shrink-0">
    <div class="flex flex-col">
      <div class="ml-6 my-4">
        <img src="../../../assets/logo.png" alt="Logo" class="h-20" />
      </div>
      <div class="mb-2 flex-grow-1">
        <div class="my-4 ml-6">
          <h3 class="font-bold">All Boards ({{ store.boards.length }})</h3>
        </div>
        <div>
          <sidebar-link
            v-for="board in store.boards"
            :key="board._id"
            :board="board"
            :is-selected="board._id === store.selectedBoard._id"
          />
          <sidebar-new-board />
        </div>
      </div>
    </div>
  </div>
</template>
