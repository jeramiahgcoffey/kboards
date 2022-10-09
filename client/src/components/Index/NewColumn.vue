<template>
  <div style="width: 320px">
    <q-btn
      style="width: 100%; height: calc(100vh - 160px); margin-top: 35px"
      @click="openCreateColumn"
    >
      <q-icon color="accent" name="mdi-plus" />

      New Column
    </q-btn>
  </div>
</template>

<script setup>
import { useStore } from 'src/stores/store';

const store = useStore();

const openCreateColumn = () => {
  store.dialogContent = 'createColumn';
  store.dialogOpen = true;
};
</script>
