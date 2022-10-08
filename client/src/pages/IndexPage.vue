<template>
  <q-page class="main-page">
    <div class="q-pa-md">
      <q-scroll-area style="height: calc(100vh - 110px); width: 100%">
        <div class="row no-wrap">
          <q-scroll-area
            v-for="(column, i) in store.columns"
            :key="i"
            style="height: calc(100vh - 110px); width: 320px"
          >
            <div
              style="letter-spacing: 1.8px"
              class="text-caption text-weight-bold text-grey-7 q-py-sm text-uppercase"
            >
              <q-icon color="primary" name="mdi-circle"></q-icon>
              {{ column }} ({{ store.tasksByColumn(column)?.length || 0 }})
            </div>
            <div>
              <q-card
                v-for="task in store.tasksByColumn(column)"
                :key="task._id"
                class="task-card q-mb-sm overflow-hidden"
              >
                <q-card-section>
                  <div class="text-h6 text-weight-regular">
                    {{ task.title }}
                  </div>
                  <div class="text-caption">0 of 0 Subtasks</div>
                </q-card-section>
              </q-card>
            </div>
          </q-scroll-area>

          <div style="width: 320px">
            <q-btn
              style="width: 100%; height: calc(100vh - 160px); margin-top: 35px"
              @click="openCreateColumn"
            >
              <q-icon color="accent" name="mdi-plus" />

              New Column
            </q-btn>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useStore } from '../stores/store';

const store = useStore();

const openCreateColumn = () => {
  store.dialogContent = 'createColumn';
  store.dialogOpen = true;
};
</script>

<style lang="sass" scoped>
.task-card
  width: 300px

.body--light .main-page
  background: $blue-grey-1
</style>
