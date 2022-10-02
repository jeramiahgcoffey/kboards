<script setup>
import { computed } from "vue";
import { useStore } from "../../../stores/store";

const store = useStore();

const props = defineProps(["task"]);

const subtasks = computed(() => {
  return props.task.subtasks.length || 0;
});
</script>

<template>
  <div
    tabindex="0"
    class="bg-gray-700 rounded-xl pt-2 mb-5 collapse collapse-arrow card card-compact"
  >
    <div class="card-body">
      <h3 class="text-white text-md pl-4 card-title">{{ props.task.title }}</h3>
      <span class="text-gray-400 text-sm collapse-title card"
        >0 of {{ subtasks }} subtasks</span
      >
      <div class="collapse-content">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Pick the best fantasy franchise</span>
          </label>
          <select class="select select-bordered">
            <option disabled selected>Pick one</option>
            <option
              v-for="column in store.selectedBoard.columns"
              :key="column"
              :value="column"
            >
              {{ column }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
