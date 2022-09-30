<template>
  <div class="bg-zinc-900 h-full p-6 overflow-y-hidden">
    <div class="flex flex-row h-full">
      <body-column
        v-for="(column, index) in columns"
        :key="index"
        :column="column"
        :tasks="getColumnTasks(column)"
      />
      <body-new-column />
    </div>
  </div>
</template>

<script>
import BodyColumn from "./BodyColumn.vue";
import BodyNewColumn from "./BodyNewColumn.vue";

export default {
  components: {
    BodyColumn,
    BodyNewColumn,
  },

  props: {
    board: {
      type: Object,
    },
  },

  computed: {
    columns() {
      return this.board.columns;
    },
  },

  methods: {
    getColumnTasks(column) {
      return this.board.tasks.filter((t) => t.status === column);
    },
  },
};
</script>
