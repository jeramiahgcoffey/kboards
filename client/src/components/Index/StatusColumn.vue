<template>
  <q-scroll-area style="height: calc(100vh - 110px); width: 320px">
    <div
      style="letter-spacing: 1.8px"
      class="text-caption text-weight-bold text-grey-7 q-py-sm text-uppercase"
    >
      <q-icon color="primary" name="mdi-circle"></q-icon>
      {{ column.name }} ({{ store.tasksByColumn(column.name)?.length || 0 }})
    </div>
    <div>
      <task-card
        v-for="task in store.tasksByColumn(column.name)"
        :key="task._id"
        :task="task"
      />
    </div>
  </q-scroll-area>
</template>

<script setup>
import TaskCard from 'src/components/Index/TaskCard.vue';
import { useStore } from 'src/stores/store';

defineProps(['column']);

const store = useStore();
</script>
