<template>
  <div class="w-72 h-full bg-gray-900 text-cyan-400 flex-shrink-0">
    <div class="flex flex-col">
      <div class="ml-6 my-4">
        <img src="../../assets/logo.png" alt="Logo" class="h-20" />
      </div>
      <div class="mb-2 flex-grow-1">
        <div class="my-4 ml-6">
          <h3 class="font-bold">All Boards (5)</h3>
        </div>
        <div>
          <sidebar-link
            v-for="(board, index) in boards"
            :key="index"
            :board="board"
            :is-selected="board === selectedBoard"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- <img src="../../assets/logo.png" alt="" class="max-w-md"> -->
</template>

<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink,
  },

  props: {
    boards: {
      type: Array,
      required: true,
    },
    selectedBoard: {
      type: String,
      required: true,
    },
  },
};
</script>
