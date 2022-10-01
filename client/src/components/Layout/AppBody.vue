<script setup>
import { useStore } from "../../stores/store";
import BodyColumn from "./BodyColumn.vue";
import BodyNewColumn from "./BodyNewColumn.vue";
import CreateBoardDialog from "../CreateBoardDialog.vue";

const store = useStore();

function getColumnTasks(column) {
  return this.store.selectedBoard.tasks.filter((t) => t.status === column);
}
</script>

<template>
  <div class="bg-zinc-900 h-full p-6 overflow-y-hidden">
    <div class="flex flex-row h-full">
      <body-column
        v-for="(column, index) in store.selectedBoard.columns"
        :key="index"
        :column="column"
        :tasks="getColumnTasks(column)"
      />
      <body-new-column />
    </div>
  </div>
  <create-board-dialog :is-open="store.isDialogOpen" />
</template>
