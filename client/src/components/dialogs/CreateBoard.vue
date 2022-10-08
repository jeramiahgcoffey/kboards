<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Create Board</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input label="Name" v-model="boardName" autofocus />
      <q-input label="Description" v-model="boardDescription" />
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
const boardDescription = ref('');

const createBoard = async () => {
  const payload = { name: boardName.value };
  if (boardDescription.value !== '')
    payload.description = boardDescription.value;
  await store.createBoard(payload);
  boardName.value = '';
};
</script>
