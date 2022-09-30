<script setup>
import AppHeader from "../components/Layout/AppHeader.vue";
import AppBody from "../components/Layout/AppBody.vue";
import AppSidebar from "../components/Layout/Sidebar/AppSidebar.vue";
</script>

<template>
  <main>
    <div class="flex h-screen">
      <div class="flex flex-col flex-shrink-0">
        <app-sidebar />
      </div>
      <div class="flex flex-col flex-grow h-full min-w-0">
        <app-header />

        <div class="flex-grow-1 overflow-auto h-screen">
          <app-body />
        </div>
      </div>
    </div>
  </main>
</template>
