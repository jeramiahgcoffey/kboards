<script setup>
import { useStore } from "../../stores/store";

const store = useStore();
</script>

<template>
  <div
    class="flex-shrink-0 flex justify-between items-center pl-4 h-24 bg-zinc-800 text-gray-100 border-l-2 border-slate-500"
  >
    <div class="text-2xl">
      <h2 class="">{{ store.selectedBoard.name }}</h2>
    </div>
    <div class="flex">
      <div class="mr-4">
        <div
          class="bg-gray-600 px-6 py-3 rounded-full text-md hover:text-cyan-200 cursor-pointer"
        >
          + Add New Task
        </div>
      </div>
      <div class="items-center flex mr-6">
        <svg
          class="w-6 h-6 hover:text-cyan-200 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>
