<template>
  <div
    :class="classes"
    class="py-3 pl-6 flex hover:bg-gray-600 rounded-r-full w-11/12 cursor-pointer"
  >
    <div class="mr-2">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        ></path>
      </svg>
    </div>
    <div>
      {{ board }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    board: String,
    isSelected: Boolean,
  },

  computed: {
    classes() {
      return this.isSelected ? "text-cyan-200 bg-gray-600" : "";
    },
  },
};
</script>
