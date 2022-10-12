<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { watch } from 'vue';
import { useAuthStore } from 'src/stores/auth/authStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const auth = useAuthStore();
const router = useRouter();

const { isLoggedIn } = storeToRefs(auth);

watch(isLoggedIn, () => {
  if (isLoggedIn.value) {
    router.push({ path: '/' });
  }
});
</script>
