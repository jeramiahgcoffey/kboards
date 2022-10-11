<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Create Column</div>
    </q-card-section>

    <q-form @submit="createColumn">
      <q-card-section class="q-pt-none">
        <q-input label="Name" v-model="columnName" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn type="submit" flat label="Create Column" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import { ref } from 'vue';

const store = useStore();

const columnName = ref('');

const createColumn = async () => {
  const payload = { name: columnName.value };

  await store.createColumn(payload);
  columnName.value = '';
};
</script>
