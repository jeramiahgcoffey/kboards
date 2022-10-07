<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Create Board</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input dense v-model="boardName" autofocus />
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Create Board" v-close-popup @click="createBoard" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import { ref } from 'vue';

const store = useStore();

const boardName = ref('');

const createBoard = async () => {
  await store.createBoard({ name: boardName.value });
  boardName.value = '';
};
</script>
