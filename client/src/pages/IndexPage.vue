<template>
  <q-page class="main-page">
    <div class="q-pa-md">
      <q-scroll-area style="height: calc(100vh - 110px); width: 100%">
        <div class="row no-wrap">
          <status-column
            v-for="(column, i) in store.columns"
            :key="i"
            :column="column"
          />
          <new-column />
        </div>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useStore } from '../stores/store';
import { useAuthStore } from 'src/stores/auth/authStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import StatusColumn from 'src/components/Index/StatusColumn.vue';
import NewColumn from 'src/components/Index/NewColumn.vue';

const store = useStore();
const auth = useAuthStore();
const router = useRouter();

const { isLoggedIn } = storeToRefs(auth);

watch(isLoggedIn, () => {
  if (!isLoggedIn.value) {
    router.push({ path: '/login' });
  }
});
</script>

<style lang="sass" scoped>
.task-card
  width: 300px

.body--light .main-page
  background: $blue-grey-1
</style>
