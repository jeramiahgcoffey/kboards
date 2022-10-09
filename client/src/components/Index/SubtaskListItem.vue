<template>
  <q-item tag="label" v-ripple class="q-pa-none q-pl-sm">
    <q-item-section>
      <q-item-label>
        {{ subtask.title }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-checkbox
        :model-value="subtask.completed"
        @update:model-value="toggleCheckbox"
        :disable="isLoading"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../../stores/store';

const store = useStore();
const props = defineProps(['taskId', 'subtask']);

const isLoading = ref(false);

const toggleCheckbox = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  await store.toggleSubtaskCompletion(props.taskId, props.subtask);
  isLoading.value = false;
};
</script>
