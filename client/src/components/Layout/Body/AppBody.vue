<script setup>
import { useStore } from "../../../stores/store";
import BodyColumn from "./BodyColumn.vue";
import BodyNewColumn from "./BodyNewColumn.vue";
import CreateBoardDialog from "../../CreateBoardDialog.vue";
import AppModal from "../../Shared/AppModal.vue";
import CreateColumnDialog from "../../CreateColumnDialog.vue";
import CreateTaskDialog from "../../CreateTaskDialog.vue";

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
  <app-modal :is-open="store.isDialogOpen">
    <create-board-dialog v-if="store.dialogContentName === 'createBoard'" />
    <create-column-dialog v-if="store.dialogContentName === 'createColumn'" />
    <create-task-dialog v-if="store.dialogContentName === 'createTask'" />
  </app-modal>
</template>
