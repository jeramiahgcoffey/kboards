<template>
  <q-card style="width: 500px">
    <q-card-section>
      <div class="text-h6">Edit Task</div>
    </q-card-section>

    <q-form @submit.prevent.stop="saveTask">
      <q-card-section class="q-pt-none">
        <q-input
          label="Title"
          v-model="store.draftTask.title"
          autofocus
          class="q-pb-md"
        />
        <q-input
          label="Description"
          type="textarea"
          v-model="store.draftTask.description"
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
          <div>
            <q-btn
              :disable="store.awaitingResponse"
              @click="handleAddSubtask"
              flat
              dense
              text-color="accent"
              >Add subtask</q-btn
            >
          </div>
        </div>
        <q-select
          v-model="store.draftTask.status"
          :options="store.columns"
          option-label="name"
          label="Status"
        />
      </q-card-section>

      <q-card-actions class="text-primary">
        <div class="row fit justify-between items-center">
          <q-btn
            :disable="store.awaitingResponse"
            flat
            label="Delete"
            color="negative"
            @click="store.deleteTask(store.draftTask._id)"
            v-close-popup
          />
          <div>
            <q-btn
              :disable="store.awaitingResponse"
              flat
              label="Cancel"
              @click="clearDraftTask"
              v-close-popup
            />
            <q-btn
              :disable="store.awaitingResponse"
              type="submit"
              flat
              label="Save Task"
              v-close-popup
            />
          </div>
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import SubtaskEditField from '../fields/SubtaskEditField.vue';

const store = useStore();

const handleAddSubtask = () => {
  store.addSubtask();
};

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
