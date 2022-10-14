<template>
  <q-card style="width: 500px">
    <q-card-section>
      <div class="text-h6">New Task</div>
    </q-card-section>

    <q-form @submit.prevent.stop="createTask">
      <q-card-section class="q-pt-none">
        <q-input
          label="Title"
          :rules="[
            (val) => (val !== null && val !== '') || 'Task title is required',
          ]"
          v-model="store.newTask.title"
          autofocus
          class="q-pb-md"
        />
        <q-input
          label="Description"
          v-model="store.newTask.description"
          type="textarea"
          autofocus
          class="q-pb-lg"
        />

        <div class="q-pb-sm">
          <span class="text-subtitle1 text-grey-8"> Subtasks </span>
          <subtask-field
            v-for="n in subtasksCount"
            :key="n"
            :id="n - 1"
            @remove-field="handleRemoveSubtask"
          />
          <q-btn
            :disable="store.awaitingResponse"
            @click="subtasksCount++"
            flat
            dense
            text-color="accent"
            >Add subtask</q-btn
          >
        </div>
        <q-select
          v-model="store.newTask.status"
          :options="store.columnNamesCapitalized"
          label="Status"
          options-selected-class=""
        />
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
          type="submit"
          flat
          label="Create Task"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import { ref, onMounted } from 'vue';
import SubtaskField from '../fields/SubtaskField.vue';

const store = useStore();

const subtasksCount = ref(3);

onMounted(() => {
  store.newTask.status = store.columnNamesCapitalized[0];
});

const handleRemoveSubtask = (id) => {
  const arr = store.newTask.subtasks;
  store.newTask.subtasks = arr.filter((t) => arr.indexOf(t) !== id);
  subtasksCount.value--;
};

const createTask = async () => {
  await store.createTask();
};
</script>
