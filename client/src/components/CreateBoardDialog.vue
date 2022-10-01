<script setup>
import { defineProps, computed } from "vue";
import { useStore } from "../stores/store";

const store = useStore();

const props = defineProps(["isOpen"]);

function createBoard() {
  store.createBoard();
  store.appModalOpen = false;
}
const classes = computed(() => (props.isOpen ? "z-10" : "-z-10"));
</script>

<template>
  <div
    :class="classes"
    class="relative"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg font-medium leading-6 text-gray-100"
                  id="modal-title"
                >
                  Create Board
                </h3>

                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text text-gray-100">Name:</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    class="input input-bordered w-80 mb-2"
                    v-model="store.newBoard.name"
                  />
                  <label class="label">
                    <span class="label-text text-gray-100">Description:</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    class="input input-bordered w-80"
                    v-model="store.newBoard.description"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
          >
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-500 bg-emerald-500 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-emerald-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="createBoard"
            >
              Create
            </button>
            <button
              @click="store.appModalOpen = false"
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-500 bg-gray-500 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
