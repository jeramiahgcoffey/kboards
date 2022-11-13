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
    <div>
      <task-card
        v-for="task in store.tasksByColumn(column._id)"
        :key="task._id"
        :task="task"
      />
    </div>
  </q-scroll-area>
</template>

<script setup>
import TaskCard from 'src/components/Index/TaskCard.vue';
import { useStore } from 'src/stores/store';

const props = defineProps(['column']);

const store = useStore();

const openEditColumn = () => {
  store.dialogContent = 'editColumn';
  store.loadDraftColumn(props.column);
  store.dialogOpen = true;
};
</script>
