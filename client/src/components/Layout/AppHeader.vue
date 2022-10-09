<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title class="text-weight-medium">
        <div style="height: 70px; display: flex; align-items: center">
          {{ store.selectedBoard?.name || '' }}
        </div>
      </q-toolbar-title>

      <div>
        <q-btn
          rounded
          padding="sm md"
          class="text-capitalize q-mr-sm"
          color="accent"
          icon="mdi-plus"
          label="Add New Task"
          @click="openCreateTask"
        />

        <q-btn rounded flat icon="mdi-dots-vertical" padding="sm" />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useStore } from 'src/stores/store';

const store = useStore();

const openCreateTask = () => {
  store.dialogContent = 'createTask';
  store.dialogOpen = true;
};
</script>
