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
            <q-btn flat text-color="primary">Edit</q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import SubtaskListItem from './SubtaskListItem.vue';

const props = defineProps(['task']);

const hasInfo = computed(
  () => !!(props.task.description || props.task.subtasks.length)
);

const caption = computed(() =>
  props.task.subtasks.length
    ? `0 of ${props.task.subtasks.length} subtasks`
    : ''
);
</script>
