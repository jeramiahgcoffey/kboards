<template>
  <div class="bg-gray-700 rounded-md px-4 py-5 mb-5">
    <h3 class="text-white text-md">{{ task.title }}</h3>
    <span class="text-gray-400 text-sm">0 of {{ subtasks }} subtasks</span>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },

  computed: {
    subtasks() {
      return this.task.subtasks.length || 0;
    },
  },
};
</script>
