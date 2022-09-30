<template>
  <div class=" w-72 h-screen dark:bg-gray-900 dark:text-cyan-400 flex-shrink-0">
    <div class="flex flex-col">
      <div class="ml-6 my-4">
        <img src="../../assets/logo.png" alt="Logo" class="h-20">
      </div>
      <div class="mb-2">
        <div class="my-4 ml-6">
          <h3 class="font-bold">All Boards (5)</h3>
        </div>
        <div>
          <sidebar-link text="Marketing Campaign" :isSelected="true" />
          <sidebar-link text="Personal Board" />
          <sidebar-link text="Code Maintenance" />
          <sidebar-link text="New UI" />
        </div>
      </div>
    </div>
  </div>
  <!-- <img src="../../assets/logo.png" alt="" class="max-w-md"> -->
</template>

<script>
import SidebarLink from './SidebarLink.vue';

export default {
  components: {
    SidebarLink
  }
}
</script>