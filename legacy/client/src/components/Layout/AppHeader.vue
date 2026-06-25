<template>
  <q-header elevated class="app-bar">
    <q-toolbar>
      <q-btn
        flat
        rounded
        v-if="!store.drawerOpen"
        @click="store.drawerOpen = true"
      >
        <q-icon name="mdi-menu"></q-icon>
      </q-btn>
      <q-toolbar-title class="text-weight-medium">
        <div style="height: 70px; display: flex; align-items: center">
          <span class="text-h5 q-pt-md ellipsis">
            {{ store.selectedBoard?.name || '' }}
          </span>
        </div>
      </q-toolbar-title>

      <div>
        <q-btn
          v-if="$q.screen.gt.sm"
          :disable="store.awaitingResponse || !store.columns.length"
          rounded
          padding="sm md"
          class="text-capitalize q-mr-sm"
          color="accent"
          icon="mdi-plus"
          label="Add New Task"
          @click="openCreateTask"
        />

        <q-btn
          v-else
          :disable="store.awaitingResponse || !store.columns.length"
          rounded
          style="width: 40px; height: 40px"
          padding="sm md"
          class="text-capitalize q-mr-sm"
          color="accent"
          icon="mdi-plus"
          @click="openCreateTask"
        />

        <q-btn
          :disable="store.awaitingResponse"
          rounded
          flat
          icon="mdi-dots-vertical"
          padding="sm"
        >
          <q-menu auto-close :offset="[0, 18]">
            <q-list>
              <q-item clickable @click="auth.logout">
                <q-item-section avatar>
                  <q-icon name="mdi-logout"></q-icon>
                </q-item-section>

                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
