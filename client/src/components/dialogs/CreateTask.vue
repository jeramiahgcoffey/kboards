<template>
  <q-card style="width: 500px">
    <q-card-section>
      <div class="text-h6">New Task</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form>
        <q-input
          label="Title"
          v-model="store.newTask.title"
          autofocus
          class="q-pb-md"
        />
        <q-input
          label="Description"
          v-model="store.newTask.description"
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
          <q-btn @click="subtasksCount++" flat dense text-color="accent"
            >Add subtask</q-btn
          >
        </div>
        <q-select
          v-model="store.newTask.status"
          :options="store.columnNamesCapitalized"
          label="Status"
          options-selected-class=""
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn flat label="Create Task" v-close-popup @click="createTask" />
    </q-card-actions>
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
