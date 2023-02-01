<template>
  <div :style="$q.screen.gt.sm ? 'width: 320px' : 'width: 100%'">
    <q-btn
      :disable="store.awaitingResponse"
      :style="
        $q.screen.gt.sm
          ? 'width: 100%; height: calc(100vh - 160px); margin-top: 35px'
          : 'width: 100%; margin-top: 10px'
      "
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
