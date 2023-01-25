<template>
  <q-scroll-area
    style="height: calc(100vh - 110px); width: 320px"
    class="q-mr-md"
  >
    <div
      style="letter-spacing: 1.8px"
      class="text-caption text-weight-bold text-grey-7 q-py-sm text-uppercase row fit justify-between items-end"
    >
      <div>
        <q-icon
          :style="{
            color: column.color === 'default' ? '#637CAA' : column.color,
          }"
          name="mdi-circle"
        ></q-icon>
        {{ column.name }} ({{ store.tasksByColumn(column._id)?.length || 0 }})
      </div>
      <div class="q-mr-lg">
        <q-btn
          size="sm"
          round
          flat
          icon="mdi-pencil-outline"
          class="q-mb-none"
          @click="openEditColumn"
        ></q-btn>
      </div>
    </div>
    <draggable
      :model-value="store.tasksByColumn(props.column._id)"
      @change="test"
      group="tasks"
      item-key="_id"
    >
      <template #item="{ element: task }">
        <task-card :task="task" />
      </template>
    </draggable>
  </q-scroll-area>
</template>

<script setup>
import TaskCard from 'src/components/Index/TaskCard.vue';
import { useStore } from 'src/stores/store';
import { computed } from '@vue/reactivity';
import draggable from 'vuedraggable';

const props = defineProps(['column']);

const store = useStore();

const openEditColumn = () => {
  store.dialogContent = 'editColumn';
  store.loadDraftColumn(props.column);
  store.dialogOpen = true;
};

const tasksByColumn = computed({
  get() {
    return store.tasksByColumn(props.column._id);
  },
  set(newValue) {
    console.log(newValue);
    return;
  },
});

const test = (e) => {
  if (e?.added?.element) {
    store.loadDraftTask(e?.added.element);
    store.draftTask.status = store.columns.find(
      (c) => c._id === props.column._id
    );
    store.updateTask();
  }
};
</script>
