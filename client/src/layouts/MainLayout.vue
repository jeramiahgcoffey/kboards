<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />

    <app-drawer />

    <app-dialog v-if="store.dialogContent">
      <create-board v-if="store.dialogContent === 'createBoard'" />
      <create-column v-if="store.dialogContent === 'createColumn'" />
      <create-task v-if="store.dialogContent === 'createTask'" />
    </app-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '../stores/store';

import AppDialog from 'src/components/AppDialog.vue';
import CreateBoard from 'src/components/dialogs/CreateBoard.vue';
import CreateColumn from 'src/components/dialogs/CreateColumn.vue';
import CreateTask from 'src/components/dialogs/CreateTask.vue';
import AppHeader from 'src/components/Layout/AppHeader.vue';
import AppDrawer from 'src/components/Layout/AppDrawer.vue';

const store = useStore();

onMounted(async () => {
  await store.fetchBoards();
});
</script>

<style lang="sass" scoped>
.control-box
  width: 80% !important
  margin: auto !important
  text-transform: uppercase !important
</style>
