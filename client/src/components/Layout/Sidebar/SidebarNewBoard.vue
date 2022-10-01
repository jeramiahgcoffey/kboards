<script setup>
import { useStore } from "../../../stores/store";

const store = useStore();
</script>

<template>
  <!-- <label for="my-modal-2" class="btn modal-button"> -->
  <div
    class="py-5 pl-6 flex hover:bg-gray-600 rounded-r-full w-11/12 cursor-pointer text-emerald-400"
    @click.stop="store.appModalOpen = true"
  >
    <div class="mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </div>
    <div>Create New Board</div>
  </div>
  <!-- </label> -->
</template>
