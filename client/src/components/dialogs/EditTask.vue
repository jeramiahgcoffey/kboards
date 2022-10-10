<template>
  <q-card style="width: 500px">
    <q-card-section>
      <div class="text-h6">Edit Task</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form>
        <q-input
          label="Title"
          v-model="store.draftTask.title"
          autofocus
          class="q-pb-md"
        />
        <q-input
          label="Description"
          v-model="store.draftTask.description"
          autofocus
          class="q-pb-lg"
        />

        <div class="q-pb-sm">
          <span class="text-subtitle1 text-grey-8"> Subtasks </span>
          <subtask-edit-field
            v-for="(subtask, i) in store.draftTask.subtasks"
            :key="subtask"
            :task="subtask"
            :index="i"
            :id="subtask._id"
            @remove-field="handleRemoveSubtask"
          />
          <q-btn @click="subtasksCount++" flat dense text-color="accent"
            >Add subtask</q-btn
          >
        </div>
        <q-select
          v-model="store.draftTask.status"
          :options="store.columnNamesCapitalized"
          label="Status"
          options-selected-class=""
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" @click="clearDraftTask" v-close-popup />
      <q-btn flat label="Save Task" v-close-popup @click="saveTask" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import SubtaskEditField from '../fields/SubtaskEditField.vue';

const store = useStore();

const handleRemoveSubtask = (id) => {
  const arr = store.draftTask.subtasks;
  store.draftTask.subtasks = arr.filter((t) => t._id !== id);
};

const clearDraftTask = () => {
  store.draftTask = {
    _id: '',
    title: '',
    description: '',
    status: '',
    subtasks: [],
  };
};

const saveTask = async () => {
  await store.updateTask();
};
</script>
