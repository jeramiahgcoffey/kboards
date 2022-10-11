<template>
  <q-page class="column items-center auth-page" padding>
    <q-img
      src="~assets/logo2.png"
      height="100px"
      width="350px"
      class="q-my-lg q-mr-md"
    />
    <q-card bordered class="form-card">
      <q-form class="q-pa-md" @submit="handleLogin">
        <q-input
          square
          v-model="credentials.email"
          type="text"
          label="Email"
          class="q-mb-md"
        />
        <q-input
          square
          v-model="credentials.password"
          type="password"
          label="Password"
          class="q-mb-md"
        />
        <div class="row reverse justify-between">
          <div>
            <q-btn type="submit" flat text-color="primary">Login</q-btn>
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth/authStore';

const auth = useAuthStore();

const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
});

const handleLogin = async () => {
  await auth.login(credentials);
  router.push({ path: '/' });
};
</script>

<style lang="sass" scoped>
.form-card
  width: 450px

.body--light .auth-page
  background: $blue-grey-1
</style>
