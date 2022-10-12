<template>
  <q-card class="q-mb-sm task-card overflow-hidden">
    <q-expansion-item :label="task.title" :caption="caption">
      <q-card class="task-card overflow-hidden">
        <q-card-section v-if="hasInfo">
          <div v-if="task.description">
            <div class="text-subtitle2 text-grey-8">Description</div>
            <div class="text-body2 q-mb-md">
              {{ task.description }}
            </div>
          </div>
          <div v-if="task.subtasks.length">
            <div class="text-subtitle2 text-grey-8">Subtasks</div>
            <div class="text-body2">
              <q-list>
                <subtask-list-item
                  v-for="(subtask, i) in task.subtasks"
                  :key="i"
                  :taskId="task._id"
                  :subtask="subtask"
                />
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <div class="fit row justify-end items-center">
            <q-btn @click="openEditTask(task)" flat text-color="primary"
              >Edit</q-btn
            >
          </div>
        </q-card-actions>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import { useStore } from 'src/stores/store';
import { computed } from 'vue';
import SubtaskListItem from './SubtaskListItem.vue';

const store = useStore();

const props = defineProps(['task']);

const hasInfo = computed(
  () => !!(props.task.description || props.task.subtasks.length)
);

const caption = computed(() =>
  props.task.subtasks.length
    ? `${props.task.subtasks.filter(t => (!!t.completed)).length} of ${props.task.subtasks.length} subtasks`
    : ''
);

const openEditTask = () => {
  store.dialogContent = 'editTask';
  if (store.draftTask._id === '') store.loadDraftTask(props.task);
  store.dialogOpen = true;
};
</script>
