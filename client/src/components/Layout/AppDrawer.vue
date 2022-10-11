<template>
  <q-drawer v-model="isDrawerOpen" behavior="desktop" show-if-above bordered>
    <q-layout view="hHh lpr lFr">
      <q-header class="app-bar">
        <q-toolbar>
          <q-img src="~assets/logo2.png" height="70px" width="250px" />
        </q-toolbar>
      </q-header>
      <q-page-container style="height: 100%">
        <q-page>
          <div
            style="letter-spacing: 1.8px"
            class="text-caption text-weight-bold text-grey-7 q-pl-lg q-pt-lg q-pb-sm"
          >
            ALL BOARDS ({{ store.boards?.length }})
          </div>
          <q-scroll-area style="width: 100%; height: calc(100vh - 250px)">
            <q-list separator>
              <q-item
                v-for="board in store.boards"
                :key="board._id"
                :active="store.selectedBoard?._id === board._id"
                @click="store.selectBoard(board)"
                clickable
                v-ripple
              >
                <q-item-section avatar class="q-pl-xs">
                  <q-icon name="mdi-math-norm-box" />
                </q-item-section>
                <q-item-section class="">{{ board.name }}</q-item-section>
              </q-item>

              <q-item @click="openCreateBoard" clickable v-ripple>
                <q-item-section avatar class="q-pl-xs">
                  <q-icon color="accent" name="mdi-plus" />
                </q-item-section>
                <q-item-section class="text-accent text-weight-bold">
                  Create New Board
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
          <q-card square flat class="q-mx-md q-mt-md">
            <q-card-section class="">
              <div class="row justify-center items-center q-mr-md">
                <q-icon color="yellow" size="26px" name="mdi-weather-sunny" />
                <q-toggle
                  :model-value="$q.dark.isActive"
                  @update:model-value="$q.dark.toggle"
                />
                <q-icon color="purple" size="24px" name="mdi-weather-night" />
              </div>
            </q-card-section>
          </q-card>
          <!-- </div> -->
        </q-page>
      </q-page-container>
    </q-layout>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useStore } from 'src/stores/store';

const store = useStore();

const $q = useQuasar();

const openCreateBoard = () => {
  store.dialogContent = 'createBoard';
  store.dialogOpen = true;
};

let isDrawerOpen = true;
</script>

<style lang="sass">
.body--dark .app-bar
  background: $dark

.body--light .app-bar
  background: white
</style>
