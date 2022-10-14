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
        <h5 class="q-mb-sm">Reset Password</h5>
      </div>
      <q-form class="q-pa-md" @submit.prevent.stop="handleResetPassword">
        <q-input
          square
          v-model="password"
          type="password"
          label="Password"
          :rules="passwordRules"
          class="q-mb-sm"
        />
        <q-input
          square
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          :rules="confirmRules"
          class="q-mb-lg"
        />
        <div class="row reverse justify-between">
          <div class="row reverse justify-start">
            <q-btn
              :disable="auth.awaitingResponse"
              type="submit"
              flat
              text-color="primary"
              >Reset Password</q-btn
            >
            <q-btn :disable="auth.awaitingResponse" no-caps flat to="/login"
              >Remember it?</q-btn
            >
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
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth/authStore';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const password = ref('');
const confirmPassword = ref('');

const passwordRules = [
  (val) => (val !== null && val !== '') || 'Password is required',
  (val) => val.length >= 8 || 'Password must be at least 8 characters',
];

const confirmRules = [
  (val) => (val !== null && val !== '') || 'Please confirm password',
  (val) => val === password.value || 'Confirmation must match password',
];

const handleResetPassword = async () => {
  const { userId, token } = route.params;

  try {
    await auth.resetPassword({ userId, token, password: password.value });
    router.push({ path: '/login' });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="sass" scoped>
.form-card
  width: 450px

.body--light .auth-page
  background: $blue-grey-1
</style>
