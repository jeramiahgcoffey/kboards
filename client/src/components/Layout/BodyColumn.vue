<template>
  <div>
    <div class="flex items-center mb-2 bg-zinc-900 w-full h-10">
      <svg
        class="w-5 h-5 text-blue-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <span class="ml-2 text-gray-400 uppercase tracking-widest text-sm"
        >{{ column }} ({{ tasks.length || 0 }})</span
      >
    </div>
    <div
      class="h-full overflow-y-hidden relative hover:overflow-y-auto scrollbar mr-5 flex-shrink-0"
    >
      <div class="mr-4">
        <div class="flex-shrink-0 w-80 h-full">
          <body-task v-for="(task, index) in tasks" :key="index" :task="task" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BodyTask from "./BodyTask.vue";

export default {
  components: {
    BodyTask,
  },

  props: {
    tasks: Array,
    column: String,
  },
};
</script>
