<template>
  <q-page class="column items-center auth-page" padding>
    <q-img
      src="~assets/logo2.png"
      height="100px"
      width="350px"
      class="q-my-xl q-mr-md"
    />
    <q-card bordered class="form-card">
      <div class="row items-center justify-center">
        <h5 class="q-mb-sm">Request Password Reset</h5>
      </div>
      <q-form class="q-pa-md" @submit.prevent.stop="handleRequestReset">
        <q-input
          square
          v-model="email"
          type="text"
          label="Email"
          :rules="emailRules"
          class="q-mb-sm"
        />
        <div class="row reverse justify-between">
          <div class="row reverse justify-start">
            <q-btn type="submit" flat text-color="primary">Request Link</q-btn>
            <q-btn no-caps flat to="/login">Remember it?</q-btn>
          </div>
          <div class="row justify-center items-center q-mr-md">
            <q-icon color="yellow" size="20px" name="mdi-weather-sunny" />
            <q-toggle
              size="35px"
              :model-value="$q.dark.isActive"
              @update:model-value="$q.dark.toggle"
            />
            <q-icon color="purple" size="18px" name="mdi-weather-night" />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth/authStore';

const auth = useAuthStore();
const router = useRouter();
const email = ref('');

const emailRules = [
  (val) => (val !== null && val !== '') || 'Email is required',
  'email',
];

const handleRequestReset = async () => {
  await auth.requestReset(email.value);
  router.push({ path: '/login' });
};
</script>

<style lang="sass" scoped>
.form-card
  width: 450px

.body--light .auth-page
  background: $blue-grey-1
</style>
