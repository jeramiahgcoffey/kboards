<template>
  <q-header elevated class="app-bar">
    <q-toolbar>
      <q-toolbar-title class="text-weight-medium">
        <div style="height: 70px; display: flex; align-items: center">
          <span class="text-h5 q-pt-md">
            {{ store.selectedBoard?.name || '' }}
          </span>
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
          :disable="!store.columnNames"
        />

        <q-btn
          @click="auth.logout"
          rounded
          flat
          icon="mdi-dots-vertical"
          padding="sm"
        />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth/authStore';
import { useStore } from 'src/stores/store';

const store = useStore();
const auth = useAuthStore();

const openCreateTask = () => {
  store.dialogContent = 'createTask';
  store.dialogOpen = true;
};
</script>

<style lang="sass">
.body--dark .app-bar
  background: $dark

.body--light .app-bar
  background: white
  color: $dark
</style>
