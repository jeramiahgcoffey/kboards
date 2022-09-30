<template>
  <main>
    <div class="flex h-screen">
      <app-sidebar />
      <div class="flex-1 w-96">
        <app-header />
        <div class="overflow-x-auto flex-nowrap">

          <app-body />
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import AppHeader from '../components/Layout/AppHeader.vue';
import AppBody from '../components/Layout/AppBody.vue';
import AppSidebar from '../components/Layout/AppSidebar.vue';

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppBody
  }
}
</script>
