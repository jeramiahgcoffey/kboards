<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-weight-medium">
          <!-- Quasar App -->
          <div style="height: 70px; display: flex; align-items: center">
            Platform Launch
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
          />

          <q-btn rounded flat icon="mdi-dots-vertical" padding="sm" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="isDrawerOpen" behavior="desktop" show-if-above bordered>
      <q-toolbar class="bg-primary">
        <q-img src="~assets/logo.png" height="70px" width="250px" />
      </q-toolbar>
      <div
        style="letter-spacing: 1.8px"
        class="text-caption text-weight-bold text-grey-7 q-pl-lg q-py-sm"
      >
        ALL BOARDS (?)
      </div>
      <q-scroll-area style="width: 100%; height: calc(100vh - 250px)">
        <q-list separator>
          <q-item
            v-for="board in store.boards"
            :key="board._id"
            clickable
            v-ripple
          >
            <q-item-section avatar class="q-pl-xs">
              <q-icon name="mdi-math-norm-box" />
            </q-item-section>
            <q-item-section class="">{{ board.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-card square flat class="q-mx-md q-mt-md">
        <q-card-section class="">
          <div class="row justify-center items-center q-mr-md">
            <q-icon color="yellow" size="26px" name="mdi-weather-sunny" />
            <q-toggle v-model="isDarkMode" />
            <q-icon color="purple" size="24px" name="mdi-weather-night" />
          </div>
        </q-card-section>
      </q-card>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from '../stores/store';

const store = useStore();

onMounted(async () => {
  await store.fetchBoards();
});

const isDrawerOpen = true;
const isDarkMode = false;
</script>

<style lang="sass" scoped>
.control-box
  width: 80% !important
  margin: auto !important
  text-transform: uppercase !important
</style>
