<template>
  <q-page class="column items-center auth-page" padding>
    <q-img
      src="~assets/logo2.png"
      style="max-width: 350px; max-height: 100px"
      class="q-my-xl q-mr-md"
    />
    <q-card bordered class="form-card">
      <div class="row items-center justify-center">
        <h5 class="q-mb-sm">Login</h5>
      </div>
      <q-form class="q-pa-md" @submit.prevent.stop="handleLogin">
        <q-input
          square
          v-model="credentials.email"
          type="text"
          label="Email"
          :rules="emailRules"
          class="q-mb-sm"
        />
        <q-input
          square
          v-model="credentials.password"
          type="password"
          label="Password"
          :rules="passwordRules"
        />
        <div class="row justify-end">
          <q-btn
            :disable="auth.awaitingResponse"
            no-caps
            flat
            to="/forgot"
            class="q-mb-lg"
            size="12px"
            padding="sm"
            >Forgot Password?</q-btn
          >
        </div>

        <div class="row reverse justify-between">
          <div class="row reverse justify-start">
            <q-btn
              :disable="auth.awaitingResponse"
              type="submit"
              flat
              text-color="primary"
              >Login</q-btn
            >
            <q-btn :disable="auth.awaitingResponse" no-caps flat to="/register"
              >Need an account?</q-btn
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
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth/authStore';

const emailRules = [
  (val) => (val !== null && val !== '') || 'Email is required',
  'email',
];

const passwordRules = [
  (val) => (val !== null && val !== '') || 'Password is required',
];

const auth = useAuthStore();

const credentials = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  await auth.login(credentials);
};
</script>

<style lang="sass" scoped>
.form-card
  max-width: 500px
  width: 100%

.body--light .auth-page
  background: $blue-grey-1
</style>
