<script setup>
import { useStore } from "../stores/store";

const store = useStore();

function createColumn() {
  store.createColumn();
  store.appModalOpen = false;
}
</script>

<template>
  <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          class="text-lg font-medium leading-6 text-gray-100"
          id="modal-title"
        >
          Add New Task
        </h3>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-gray-100">Name:</span>
          </label>
          <input
            type="text"
            placeholder=""
            class="input input-bordered w-80 mb-2"
            v-model="store.newColumn"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
    <button
      type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-500 bg-emerald-500 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-emerald-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      @click="createColumn"
    >
      Create
    </button>
    <button
      @click="store.closeAppModal"
      type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-500 bg-gray-500 px-4 py-2 text-base font-medium text-gray-100 shadow-sm hover:bg-gray-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Cancel
    </button>
  </div>
</template>
