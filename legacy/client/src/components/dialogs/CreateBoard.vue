<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Create Board</div>
    </q-card-section>

    <q-form @submit.stop.prevent="createBoard">
      <q-card-section class="q-pt-none">
        <q-input
          :rules="[
            (val) => (val !== null && val !== '') || 'Board name is required',
          ]"
          label="Name"
          v-model="boardName"
          autofocus
          class="q-pb-sm"
        />
        <q-input label="Description" v-model="boardDescription" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          :disable="store.awaitingResponse"
          flat
          label="Cancel"
          v-close-popup
        />
        <q-btn
          :disable="store.awaitingResponse"
          flat
          type="submit"
          label="Create Board"
        />
      </q-card-actions>
    </q-form>
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
};
</script>
